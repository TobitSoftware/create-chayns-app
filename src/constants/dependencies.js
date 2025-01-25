export const v4Deps = {
    'chayns-components': 'latest',
    'prop-types': 'latest',
    react: '18',
    'react-dom': '18',
};

export const v4DevDeps = {
    'chayns-toolkit': 'latest',
    prettier: 'latest',
    'prettier-plugin-packagejson': 'latest',
};

export const getV5Deps = (reactVersion) => ({
    '@chayns-components/core': 'latest',
    'prop-types': 'latest',
    react: String(reactVersion),
    'react-dom': String(reactVersion),
    'chayns-api': 'latest',
});

export const v5DevDeps = {
    'chayns-toolkit': 'latest',
    prettier: 'latest',
    'prettier-plugin-packagejson': 'latest',
};

export const reduxDeps = {
    'react-redux': 'latest',
    '@reduxjs/toolkit': 'latest',
};

export const getTypescriptDevDeps = (reactVersion) => ({
    typescript: 'latest',
    '@types/react': String(reactVersion),
    '@types/react-dom': String(reactVersion),
});

export const testDevDeps = {
    '@testing-library/jest-dom': 'latest',
    '@testing-library/react': 'latest',
    '@testing-library/user-event': 'latest',
    '@vitejs/plugin-react': 'latest',
    '@vitest/coverage-v8': 'latest',
    jsdom: 'latest',
    vitest: 'latest',
};
