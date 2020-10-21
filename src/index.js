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
const ProjectTypes = require('./projectTypes');
const ora = require('ora');

const { command } = execa;

const program = new Command();

program
    .version(pkg.version)
    .option('-G, --no-git', 'initialize the project without a git repository')
    .option('-C, --no-initial-commit', "don't perform an initial commit")
    .option('-I, --no-install', "don't install packages after initialization")
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
}) {
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

    console.log(
        `\n${chalk.bold.magentaBright(
            'Awesome!'
        )} Please wait a quick second while we bootstrap your project...\n`
    );

    const usedPackageManager = packageManager || (isYarn ? 'yarn' : 'npm');

    function fillTemplates(content) {
        return mapReplace(content, {
            'package-name': projectName,
            description: summary,
            'install-command':
                usedPackageManager === 'yarn' ? 'yarn' : 'npm install',
            'run-command': usedPackageManager === 'yarn' ? 'yarn' : 'npm run',
        });
    }

    const destination = path.resolve(projectName);

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
