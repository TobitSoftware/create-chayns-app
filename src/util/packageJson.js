import { reduxDeps, getTypescriptDevDeps, v4Deps, v4DevDeps, getV5Deps, v5DevDeps, testDevDeps } from "../constants/dependencies";
import { ProjectVersions } from "../projectTypes";
import { resolvePackageVersion } from "./resolvePackageVersion";
import path from "path";
import fs from "fs";
import ora from "ora";

const createBaseConfig = (name, description) => ({
    name,
    "version": "1.0.0",
    "private": true,
    description,
    "keywords": ["chayns", "chayns-toolkit", "react"],
    "scripts": {
        "build": "chayns-toolkit build",
        "dev": "chayns-toolkit dev",
        "start": "chayns-toolkit dev",
        "format": "prettier . --write",
        "lint": "chayns-toolkit lint"
    },
    "prettier": {
        "proseWrap": "always",
        "singleQuote": true,
        "tabWidth": 4
    },
    "eslintConfig": {
        "extends": "@chayns-toolkit"
    },
    dependencies: {},
    devDependencies: {}
})

export const buildPackageJson = async ({ name, description = '', devDependencies = {}, dependencies = {}, useTypescript, useVitest }) => {
    const config = createBaseConfig(name, description);

    for (let [k, v] of Object.entries(devDependencies).sort(([a], [b]) => a.localeCompare(b))) {
        config.devDependencies[k] = await resolvePackageVersion(k, v);
    }

    for (let [k, v] of Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b))) {
        config.dependencies[k] = await resolvePackageVersion(k, v);
    }

    if (useTypescript) {
        config.scripts['check-types'] = 'tsc';
    }

    if (useVitest) {
        config.scripts.test = 'vitest';
    }

    return JSON.stringify(config, undefined, 4);
}

export const createPackageJson = async ({ destination, projectVersion, reactVersion, useRedux, ...options }) => {
    const { useTypescript, useVitest } = options;
    const spinner = ora(`Resolving latest versions of required dependencies`).start();
    let content;
    const packageJsonDestination = path.join(destination, 'package.json');
    if (projectVersion === ProjectVersions.v4) {
        content = await buildPackageJson({
            ...options,
            dependencies: v4Deps,
            devDependencies: v4DevDeps,
        })
    } else {
        const dependencies = getV5Deps(reactVersion);
        const devDependencies = { ...v5DevDeps }
        if (useRedux) {
            Object.assign(dependencies, reduxDeps);
        }
        if (useTypescript) {
            Object.assign(devDependencies, getTypescriptDevDeps(reactVersion));
        }
        if (useVitest) {
            Object.assign(devDependencies, testDevDeps);
        }
        content = await buildPackageJson({ ...options, dependencies, devDependencies });
    }
    spinner.succeed('Resolved latest versions of required dependencies');

    fs.writeFileSync(packageJsonDestination, content);
}