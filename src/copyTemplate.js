const path = require('path');
const mkdirp = require('mkdirp');
const { promisify } = require('util');
const fs = require('fs');
const glob = require('fast-glob');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

module.exports = async function copyTemplate({
    destination,
    templateDir,
    adjustContent,
}) {
    const filenames = await glob('**/*', { cwd: templateDir });

    const filePromises = filenames.map(async (filename) => {
        let content = await readFileAsync(path.join(templateDir, filename), {
            encoding: 'utf-8',
        });

        if (typeof adjustContent === 'function') {
            content = adjustContent(content);
        }

        const realFileName = filename
            .replace('template-gitignore', '.gitignore')
            .replace('template-package.json', 'package.json');

        const fileDestination = path.join(destination, realFileName);

        await mkdirp(path.join(fileDestination, '..'));
        await writeFileAsync(fileDestination, content);
    });

    await Promise.all(filePromises);
};
