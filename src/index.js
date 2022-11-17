#! /usr/bin/env node

const { prompt } = require('enquirer');
const validate = require('validate-npm-package-name');
const chalk = require('chalk');
const copyTemplate = require('./copyTemplate');
const path = require('path');
const { isYarn } = require('is-npm');
const mapReplace = require('./util/mapReplace');
const execa = require('execa');
const { Command } = require('commander');
const pkg = require('../package.json');
const {ProjectTypes, ProjectVersions, YesOrNo} = require('./projectTypes');
const ora = require('ora');
const toCapitalizedWords = require('./util/toCapitalizedWords');
const {promisify} = require("util");
const fs = require("fs");
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const { command } = execa;

const program = new Command();

program
    .version(pkg.version)
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
    const { projectVersion } = await prompt({
        type: 'select',
        name: 'projectVersion',
        message: 'What api version do you want to use?',
        choices: Object.values(ProjectVersions),
    });

    const { projectType } = await prompt({
        type: 'select',
        name: 'projectType',
        message: 'What type of project do you want to create?',
        choices: Object.values(ProjectTypes),
    });

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
    } else {
        const { chooseRedux } = await prompt({
            type: 'select',
            name: 'chooseRedux',
            message: 'Do you want to add redux-toolkit?',
            choices: Object.values(YesOrNo),
        });

        const { chooseTypescript } = await prompt({
            type: 'select',
            name: 'chooseTypescript',
            message: 'Do you want to add typescript?',
            choices: Object.values(YesOrNo),
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
                    'run-command': usedPackageManager === 'yarn' ? 'yarn' : 'npm run',
                })
            }
            await writeFileAsync(to, content);
        }

        const handleReplace = (content) => {
           return mapReplace(fillTemplates(content), {
                'tapp-style': projectType === ProjectTypes.pagemakerPlugin ? ' style="padding: 0 0 16px !important"' : '',
            });
        }

        // redux modules
        if(chooseRedux === YesOrNo.Yes) {
            const templateSharedPath = `../templates/api-v5/shared/${chooseTypescript === YesOrNo.Yes ? 'ts' : 'js'}/src`;
            await copyTemplate({
                destination: destination + "/src",
                projectName,
                templateDir: path.join(
                    ` ${__dirname} `.trim(),
                    templateSharedPath
                )
            });
        }

        // Main template
        const templatePath = `../templates/api-v5/page${chooseTypescript === YesOrNo.Yes ? "-ts" : ""}${module ? "-module":""}${chooseRedux === YesOrNo.Yes ? "-redux" : ""}`;
        await copyTemplate({
            destination,
            projectName,
            templateDir: getTemplatePath(templatePath),
            adjustContent: handleReplace
        });

        // copy package json
        const packageJsonDestination = path.join(destination, 'package.json');
        await copyFile(getTemplatePath(`../templates/api-v5/shared/${chooseTypescript === YesOrNo.Yes ? "ts" : "js"}/template-package${chooseRedux === YesOrNo.Yes ? "-redux" : ""}.json`), packageJsonDestination, true);

        // copy README
        await copyFile(getTemplatePath(`../templates/shared/README.md`),  path.join(destination, 'README.md'), true);

        // copy gitignore
        await copyFile(getTemplatePath(`../templates/shared/template-gitignore`),  path.join(destination, '.gitignore'), true);

        // copy tsconfig.json
        if(chooseTypescript === YesOrNo.Yes) {
            await copyFile(getTemplatePath(`../templates/api-v5/shared/ts/tsconfig.json`), path.join(destination, 'tsconfig.json'));
        }

        if(module) {
            const toolkitFileName = `toolkit.config-module.js`;
            const fileDestination = path.join(destination, 'toolkit.config.js');

            await copyFile(getTemplatePath(`../templates/api-v5/shared/${toolkitFileName}`), fileDestination);
        }
    }

    if (git) {
        const spinner = ora('Initializing Git repository').start();
        try {
            await command('git init', { cwd: destination });
            spinner.succeed('Initialized a Git repository');
        } catch {
            spinner.fail(
                `Failed to initialize a Git repository. You can do this yourself by running ${chalk.cyanBright(
                    `git init`
                )}.`
            );
        }
    }

    if (install) {
        const spinner = ora(
            `Installing packages using ${chalk.blueBright(usedPackageManager)}`
        ).start();
        try {
            await command(`${usedPackageManager} install`, {
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
            await command('git add .', { cwd: destination });
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
