import {
    reduxDeps,
    getTypescriptDevDeps,
    v4Deps,
    v4DevDeps,
    getV5Deps,
    v5DevDeps,
    testDevDeps,
    internalDeps,
    internalDepsPrivateRegistry,
} from '../constants/dependencies.js';
import { ProjectVersions } from '../constants/projectTypes.js';
import { resolvePackageVersion } from './resolvePackageVersion.js';
import path from 'path';
import fs from 'fs';
import ora from 'ora';

const reactPeerPackages = ['react', 'react-dom'];

const toMinorPeerRange = (version) => {
    const match = version.match(/^(?:[~^])?(\d+)\.(\d+)\.\d+/);
    if (!match) {
        return version;
    }

    return `^${match[1]}.${match[2]}.0`;
};

const createBaseConfig = (name, description) => ({
    name,
    version: '1.0.0',
    private: true,
    description,
    keywords: ['chayns', 'chayns-toolkit', 'react'],
    scripts: {
        build: 'chayns-toolkit build',
        dev: 'chayns-toolkit dev',
        start: 'chayns-toolkit dev',
        format: 'prettier . --write',
        lint: 'chayns-toolkit lint',
    },
    prettier: {
        proseWrap: 'always',
        singleQuote: true,
        tabWidth: 4,
        printWidth: 100,
    },
    dependencies: {},
    devDependencies: {},
});

export const buildPackageJson = async ({
    name,
    description = '',
    devDependencies = {},
    dependencies = {},
    peerDependencies = {},
    useTypescript,
    useVitest,
}) => {
    const config = createBaseConfig(name, description);

    for (let [k, v] of Object.entries(devDependencies).sort(([a], [b]) => a.localeCompare(b))) {
        config.devDependencies[k] = await resolvePackageVersion(k, v);
    }

    for (let [k, v] of Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b))) {
        config.dependencies[k] = await resolvePackageVersion(k, v);
    }

    const peerDependencyEntries = Object.entries(peerDependencies).sort(([a], [b]) =>
        a.localeCompare(b),
    );
    if (peerDependencyEntries.length) {
        config.peerDependencies = {};
        for (let [k, v] of peerDependencyEntries) {
            const resolvedVersion = config.devDependencies[k] || (await resolvePackageVersion(k, v));
            config.peerDependencies[k] = toMinorPeerRange(resolvedVersion);
        }
    }

    if (useTypescript) {
        config.scripts['check-types'] = 'tsc';
    }

    if (useVitest) {
        config.scripts.test = 'vitest';
    }

    return JSON.stringify(config, undefined, 4);
};

export const createPackageJson = async ({
    destination,
    projectVersion,
    reactVersion,
    useRedux,
    tobitInternal,
    moduleFederation,
    ...options
}) => {
    const { useTypescript, useVitest } = options;
    const spinner = ora(`Resolving latest versions of required dependencies`).start();
    let content;
    const packageJsonDestination = path.join(destination, 'package.json');
    if (projectVersion === ProjectVersions.v4) {
        content = await buildPackageJson({
            ...options,
            dependencies: v4Deps,
            devDependencies: v4DevDeps,
        });
    } else {
        const dependencies = getV5Deps(reactVersion);
        const devDependencies = { ...v5DevDeps };
        const peerDependencies = {};
        if (moduleFederation) {
            for (const packageName of reactPeerPackages) {
                devDependencies[packageName] = dependencies[packageName];
                peerDependencies[packageName] = dependencies[packageName];
                delete dependencies[packageName];
            }
        }
        if (useRedux) {
            Object.assign(dependencies, reduxDeps);
        }
        if (useTypescript) {
            Object.assign(devDependencies, getTypescriptDevDeps(reactVersion));
            delete dependencies['prop-types'];
        }
        if (useVitest) {
            Object.assign(devDependencies, testDevDeps);
        }
        if (tobitInternal) {
            Object.assign(dependencies, internalDeps, internalDepsPrivateRegistry);
        }
        content = await buildPackageJson({
            ...options,
            dependencies,
            devDependencies,
            peerDependencies,
        });
    }
    spinner.succeed('Resolved latest versions of required dependencies');

    fs.writeFileSync(packageJsonDestination, content);
};
