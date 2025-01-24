#! /usr/bin/env node

import { prompt } from 'enquirer';
import validate from 'validate-npm-package-name';
import chalk from 'chalk';
import path from 'path';
import { isYarn } from 'is-npm';
import execa, { command as execaCommand } from 'execa';
import { Command } from 'commander';
import ora from 'ora';
import fs from "fs";
import { writeFile as writeFileAsync, readFile as readFileAsync } from 'fs/promises';
import { version } from '../package.json';
import { ProjectTypes, ProjectVersions, YesOrNoChoices } from './constants/projectTypes';
import copyTemplate from './util/copyTemplate';
import mapReplace from './util/mapReplace';
import { createPackageJson } from './util/packageJson';
import toCapitalizedWords from './util/toCapitalizedWords';

const program = new Command();

program
    .version(version)
    .option('-G, --no-git', 'initialize the project without a git repository')
    .option('-C, --no-initial-commit', "don't perform an initial commit")
    .option('-I, --no-install', "don't install packages after initialization")
    .option('-M, --module-federation', "install to use as module (only internal)")
    .option(
        '-p, --package-manager <manager>',
        'specify the package manager to use (`npm` or `yarn`). Defaults to the one used to execute the command.'
    )
    .action(createChaynsApp)
    .parse(process.argv);

async function createChaynsApp({
    git,
    initialCommit,
    install,
    packageManager,
    moduleFederation
}) {
    let projectVersion;
    let projectType;

    if(!moduleFederation) {
        ({ projectVersion } = await prompt({
            type: 'select',
            name: 'projectVersion',
            message: 'What api version do you want to use?',
            choices: Object.values(ProjectVersions),
        }));
        ({ projectType } = await prompt({
            type: 'select',
            name: 'projectType',
            message: 'What type of project do you want to create?',
            choices: Object.values(ProjectTypes),
        }));
    }

    let validPackageName = false;
    let projectName;

    while (!validPackageName) {
        // eslint-disable-next-line no-await-in-loop
        const { packageName } = await prompt([
            {
                type: 'input',
                name: 'packageName',
                message: 'What should the name of your project be?',
                initial: 'my-awesome-project',
            },
        ]);

        const { validForNewPackages, errors = [], warnings = [] } = validate(
            packageName
        );

        if (!validForNewPackages) {
            console.log(
                `\n${chalk.hex('#31D1DF')(
                    `\`${packageName}\``
                )} is unfortunately not a valid project name, because:`
            );
            for (const message of [...errors, ...warnings]) {
                console.log(chalk.hex('#94A3B8')(`  - ${message}`));
            }
            console.log('');
        } else {
            validPackageName = true;
            projectName = packageName;
        }
    }

    const { summary } = await prompt({
        type: 'input',
        message: 'How would you summarize this project in a few words?',
        name: 'summary',
    });

    function fillTemplates(content) {
        return mapReplace(content, {
            'package-name': projectName,
            'readable-package-name': toCapitalizedWords(projectName),
            description: summary,
            'install-command':
                usedPackageManager === 'yarn' ? 'yarn' : 'npm install',
            'run-command': usedPackageManager === 'yarn' ? 'yarn' : 'npm run',
            'package-name-underscore': projectName.replace('-', '_')
        });
    }

    const destination = path.resolve(projectName);

    const usedPackageManager = packageManager || (isYarn ? 'yarn' : 'npm');
    if(projectVersion === ProjectVersions.v4) {
        console.log(
            `\n${chalk.bold.magentaBright(
                'Awesome!'
            )} Please wait a quick second while we bootstrap your project...\n`
        );

        switch (projectType) {
            case ProjectTypes.page:
                await copyTemplate({
                    destination,
                    templateDir: path.join(
                        /**
                         * Do some nasty dynamic stuff to the __dirname so the
                         * relocate loader doesn't copy the template folder.
                         */
                        ` ${__dirname} `.trim(),
                        '../templates/page'
                    ),
                    adjustContent: (content) =>
                        mapReplace(fillTemplates(content), { 'tapp-style': '' }),
                });
                break;
            case ProjectTypes.pagemakerPlugin:
                await copyTemplate({
                    destination,
                    projectName,
                    templateDir: path.join(
                        ` ${__dirname} `.trim(),
                        '../templates/page'
                    ),
                    adjustContent: (content) =>
                        mapReplace(fillTemplates(content), {
                            'tapp-style': ' style="padding: 0 0 16px !important"',
                        }),
                });
                break;
        }
        await createPackageJson({
            name: projectName,
            description: summary,
            destination,
            projectVersion,
        });
    } else {
        const { reactVersion } = await prompt({
            type: 'select',
            name: 'reactVersion',
            message: 'Which react version do you want to use?',
            choices: [{ name: 'v18', value: 18 }, { name: 'v19', value: 19 }],
            result (selected) {
                return this.map(selected)[selected];
            }
        });

        const { useRedux } = await prompt({
            type: 'select',
            name: 'useRedux',
            message: 'Do you want to add redux-toolkit?',
            choices: YesOrNoChoices,
            result (selected) {
                return this.map(selected)[selected];
            },
        });

        const { useTypescript } = await prompt({
            type: 'select',
            name: 'useTypescript',
            message: 'Do you want to add typescript?',
            choices: YesOrNoChoices,
            result (selected) {
                return this.map(selected)[selected];
            },
        });

        const { useVitest } = await prompt({
            type: 'select',
            name: 'useVitest',
            message: 'Do you want to add vitest?',
            choices: YesOrNoChoices,
            result (selected) {
                return this.map(selected)[selected];
            },
        });

        const getTemplatePath = (temp) =>  path.join(` ${__dirname} `.trim(), temp)
        const copyFile = async (from, to, map) => {
            let content = await readFileAsync(from, { encoding: 'utf-8' });
            if(map) {
                content = mapReplace(content, {
                    'package-name': projectName,
                    'readable-package-name': toCapitalizedWords(projectName),
                    description: summary,
                    'install-command':
                        usedPackageManager === 'yarn' ? 'yarn' : 'npm install',
                    'run-command': usedPackageManager === 'yarn' ? 'yarn' : 'npm run'
                })
            }
            await writeFileAsync(to, content);
        }

        const handleReplace = (content) => {
           return mapReplace(fillTemplates(content), {
                'tapp-style': projectType === ProjectTypes.pagemakerPlugin ? ' style="padding: 0 0 16px !important"' : '',
            });
        }

        const extension = useTypescript ? 'ts' : 'js';

        // redux modules
        if(useRedux) {
            const templateSharedPath = `../templates/api-v5/shared/${extension}/src`;
            await copyTemplate({
                destination: destination + "/src",
                projectName,
                templateDir: path.join(
                    ` ${__dirname} `.trim(),
                    templateSharedPath
                )
            });
            await copyFile(getTemplatePath(`../templates/api-v5/shared/ts/.eslintrc`), path.join(destination, '.eslintrc'));
        }

        // Main template
        const templatePath = `../templates/api-v5/page${useTypescript ? "-ts" : ""}${moduleFederation ? "-module":""}${useRedux ? "-redux" : ""}`;
        await copyTemplate({
            destination,
            projectName,
            templateDir: getTemplatePath(templatePath),
            adjustContent: handleReplace
        });

        // create package json
        await createPackageJson({
            name: projectName,
            description: summary,
            destination,
            projectVersion,
            reactVersion,
            useRedux,
            useTypescript,
            useVitest,
        });

        // copy README
        await copyFile(getTemplatePath(`../templates/shared/README.md`),  path.join(destination, 'README.md'), true);

        // copy gitignore
        await copyFile(getTemplatePath(`../templates/shared/template-gitignore`),  path.join(destination, '.gitignore'), true);

        await copyFile(getTemplatePath(`../templates/api-v5/shared/.env`), path.join(destination, '.env'));
        await copyFile(getTemplatePath(`../templates/api-v5/shared/.env.development.local`), path.join(destination, '.env.development.local'));

        if (!fs.existsSync(path.join(destination, '/src/constants'))) {
            fs.mkdirSync(path.join(destination, '/src/constants'));
        }

        await copyFile(getTemplatePath(`../templates/api-v5/shared/${extension}/src/constants/server-urls.${extension}`), path.join(destination, `/src/constants/server-urls.${extension}`));

        // copy tsconfig.json
        if(useTypescript) {
            await copyFile(getTemplatePath(`../templates/api-v5/shared/ts/tsconfig.json`), path.join(destination, 'tsconfig.json'));

            if (!fs.existsSync(path.join(destination, '/src/types'))) {
                fs.mkdirSync(path.join(destination, '/src/types'));
            }
            await copyFile(getTemplatePath(`../templates/api-v5/shared/ts/src/types/global.d.ts`), path.join(destination, '/src/types/global.d.ts'));
            await copyFile(getTemplatePath(`../templates/api-v5/shared/ts/src/types/environment.d.ts`), path.join(destination, '/src/types/environment.d.ts'));
        }

        if (useVitest) {
            if (!fs.existsSync(path.join(destination, '/tests'))) {
                fs.mkdirSync(path.join(destination, '/tests'));
            }
            await copyFile(getTemplatePath('../templates/shared/tests/setup.js'), path.join(destination, '/tests/setup.js'));
            await copyFile(getTemplatePath(`../templates/shared/vitest.config.mjs`), path.join(destination, `/vitest.config.m${extension}`));
        }

        const fileDestination = path.join(destination, 'toolkit.config.js');
        if(moduleFederation) {
            const toolkitFileName = `toolkit.config-module.js`;
            await copyFile(getTemplatePath(`../templates/api-v5/shared/${toolkitFileName}`), fileDestination);
        } else {
            await copyFile(getTemplatePath(`../templates/api-v5/shared/toolkit.config.js`), fileDestination);
        }
    }

    if (git) {
        const spinner = ora('Initializing Git repository').start();
        try {
            await execaCommand('git init', { cwd: destination });
            spinner.succeed('Initialized a Git repository');
        } catch(e) {
            spinner.fail(
                `Failed to initialize a Git repository. You can do this yourself by running ${chalk.cyanBright(
                    `git init`
                )}.`
            );
            throw e;
        }
    }

    if (install) {
        const spinner = ora(
            `Installing packages using ${chalk.blueBright(usedPackageManager)}`
        ).start();
        try {
            await execaCommand(`${usedPackageManager} install`, {
                cwd: destination,
            });
            spinner.succeed(
                `Installed packages with ${chalk.blueBright(
                    usedPackageManager
                )}`
            );
        } catch {
            spinner.fail(
                `Failed to install packages with ${chalk.blueBright(
                    usedPackageManager
                )}. You can do this yourself by running ${chalk.cyanBright(
                    `${usedPackageManager} install`
                )}.`
            );
        }
    }

    if (git && initialCommit) {
        const spinner = ora('Performing an initial commit').start();
        try {
            await execaCommand('git add .', { cwd: destination });
            await execa('git', ['commit', '-m', ':tada: Initial commit'], {
                cwd: destination,
            });
            spinner.succeed('Perfomed an initial commit');
        } catch (e) {
            console.error(e);
            spinner.fail('Failed to perform an initial commit.');
        }
    }

    console.log(
        `\n${chalk.bold.greenBright(
            'Congrats!'
        )} Your new project is ready to go!`
    );

    const runCommand =
        usedPackageManager === 'yarn' ? 'yarn dev' : 'npm run dev';

    console.log(
        `Open the created ${chalk.yellowBright(
            `./${projectName}/`
        )} folder in your favorite editor and start ${chalk.cyanBright(
            '`' + runCommand + '`'
        )}.\n`
    );
}
