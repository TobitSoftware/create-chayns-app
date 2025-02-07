import { exec } from 'node:child_process';
import chalk from 'chalk';
import semver from 'semver';
import { internalDeps } from '../constants/dependencies.js';

export const resolvePackageVersion = async (pkg, tag) => {
    const target = tag ? `${pkg}@${tag}` : pkg;
    if (pkg in internalDeps) {
        try {
            const res = await fetch(`https://repo.tobit.ag/repository/npm/${pkg}`);
            if (res.ok) {
                const json = await res.json();

                if (tag in json['dist-tags']) {
                    return `^${json['dist-tags'][tag]}`;
                }

                const version = semver.maxSatisfying(Object.keys(json.versions), tag);
                if (version) {
                    return `^${version}`;
                }
            }
        } catch {
            //
        }
    }

    try {
        const result = await new Promise((resolve, reject) => {
            exec(`npm view ${target} version --json`, (error, out) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(out.trim());
                }
            });
        });
        const parsedResult = JSON.parse(result);
        const version = Array.isArray(parsedResult) ? parsedResult.pop() : parsedResult;
        return `^${version}`;
    } catch {
        //
    }

    console.warn(`\n  Could not resolve ${chalk.yellow(target)}`);
    return tag || 'latest';
};
