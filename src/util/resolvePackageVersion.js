import { exec } from 'node:child_process';
import chalk from 'chalk';
import { internalDeps } from '../constants/dependencies.js';

export const resolvePackageVersion = async (pkg, tag) => {
    const target = tag ? `${pkg}@${tag}` : pkg;


    try {
        const result = await new Promise((resolve, reject) => {
            exec(`npm view ${target} version --json${pkg in internalDeps ? ' --registry https://repo.tobit.ag/repository/npm/' : ''}`, (error, out) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(out.trim());
                }
            });
        });
        const parsedResult = JSON.parse(result);
        let version;
        if (Array.isArray(parsedResult)) {
            version = parsedResult.reduce((max, current) => {
                const maxParts = max.split('.').map(Number);
                const currentParts = current.split('.').map(Number);
                for (let i = 0; i < Math.max(maxParts.length, currentParts.length); i++) {
                    const maxNum = maxParts[i] || 0;
                    const currentNum = currentParts[i] || 0;
                    if (currentNum > maxNum) return current;
                    if (currentNum < maxNum) return max;
                }
                return max;
            });
        } else {
            version = parsedResult;
        }
        return `^${version}`;
    } catch {
        //
    }

    console.warn(`\n  Could not resolve ${chalk.yellow(target)}`);
    return tag || 'latest';
};
