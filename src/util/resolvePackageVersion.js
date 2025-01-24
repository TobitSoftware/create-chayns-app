import { exec } from "node:child_process";

export const resolvePackageVersion = async (pkg, tag) => {
    const target = tag ? `${pkg}@${tag}` : pkg;
    const result = await new Promise((resolve, reject) => {
        exec(`npm view ${target} version --json`, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out.trim())
            }
        })
    })
    const parsedResult = JSON.parse(result);
    const version = Array.isArray(parsedResult) ? parsedResult.pop() : parsedResult;
    return `^${version}`;
}