import path from 'path';
import { mkdir, writeFile, readFile } from 'fs/promises';
import glob from 'fast-glob';

export default async function copyTemplate({ destination, templateDir, adjustContent }) {
    const filenames = await glob('**/*', { cwd: templateDir });

    const filePromises = filenames.map(async (filename) => {
        let content = await readFile(path.join(templateDir, filename), {
            encoding: 'utf-8',
        });

        if (typeof adjustContent === 'function') {
            content = adjustContent(content);
        }

        const realFileName = filename
            .replace('template-gitignore', '.gitignore')
            .replace('template-package-redux.json', 'package.json')
            .replace('template-package.json', 'package.json');

        const fileDestination = path.join(destination, realFileName);

        await mkdir(path.join(fileDestination, '..'), { recursive: true });
        await writeFile(fileDestination, content);
    });

    await Promise.all(filePromises);
}
