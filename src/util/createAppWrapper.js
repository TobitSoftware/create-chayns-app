
export const createAppWrapper = ({ useTypescript, moduleFederation, useRedux, tobitInternal, packageNameUnderscore }) => {
    const lines = [];
    let indent = 0;

    const reactNamedImportsList = [];
    if (moduleFederation && useTypescript) {
        reactNamedImportsList.push('ComponentPropsWithoutRef');
    }
    if (tobitInternal) {
        reactNamedImportsList.push('Suspense');
    }
    if (moduleFederation && useRedux) {
        reactNamedImportsList.push('useState');
    }
    const reactNamedImports = reactNamedImportsList.length ? `, { ${reactNamedImportsList.join(', ')} }` : '';

    lines.push(`import React${reactNamedImports} from 'react';`);

    if (useRedux) {
        lines.push(`import { Provider } from 'react-redux';`);
    }

    lines.push(`import { ChaynsProvider${moduleFederation ? ', withCompatMode' : ''} } from 'chayns-api';`)
    lines.push(`import { PageProvider } from '@chayns-components/core';`);
    if (tobitInternal) {
        lines.push(`import { TextStringProvider } from 'tobit-textstrings';`);
    }
    lines.push(`import App from './App';`)
    if (useRedux) {
        lines.push(`import ${moduleFederation ? '{ createStore }' : 'store'} from '../redux-modules';`);
    }
    if (tobitInternal && moduleFederation) {
        lines.push(`import '../utils/logger';`);
    }
    lines.push('');
    if (tobitInternal) {
        lines.push('// TODO: insert your libraryName');
        lines.push(`const libraries = ['<libraryName>'];`);
        lines.push('');
    }

    if (moduleFederation && useRedux) {
        lines.push(`const AppWrapper = (${moduleFederation ? 'props' : ''}${moduleFederation && useTypescript ? ': ComponentPropsWithoutRef<typeof ChaynsProvider>' : ''}) => {`);
        indent += 4;
        lines.push(`${' '.repeat(indent)}const [store] = useState(createStore);`);
        lines.push('');
        lines.push(`${' '.repeat(indent)}return (`);
    } else {
        lines.push(`const AppWrapper = (${moduleFederation ? 'props' : ''}${moduleFederation && useTypescript ? ': ComponentPropsWithoutRef<typeof ChaynsProvider>' : ''}) => (`);
    }
    indent += 4;

    if (moduleFederation) {
        lines.push(`${' '.repeat(indent)}<div className="${packageNameUnderscore}">`);
        indent += 4;
        lines.push(`${' '.repeat(indent)}{/* eslint-disable-next-line react/jsx-props-no-spreading */}`);
    }

    lines.push(`${' '.repeat(indent)}<ChaynsProvider${moduleFederation ? ' {...props}' : ''}>`);
    indent += 4;

    if (useRedux) {
        lines.push(`${' '.repeat(indent)}<Provider store={store}>`);
        indent += 4;
    }

    lines.push(`${' '.repeat(indent)}<PageProvider>`);
    indent += 4;

    if (tobitInternal) {
        lines.push(`${' '.repeat(indent)}<Suspense>`);
        indent += 4;
        lines.push(`${' '.repeat(indent)}<TextStringProvider libraries={libraries}>`);
        indent += 4;
    }

    lines.push(`${' '.repeat(indent)}<App />`);

    if (tobitInternal) {
        indent -= 4;
        lines.push(`${' '.repeat(indent)}</TextStringProvider>`);
        indent -= 4;
        lines.push(`${' '.repeat(indent)}</Suspense>`);
    }

    indent -= 4;
    lines.push(`${' '.repeat(indent)}</PageProvider>`);

    if (useRedux) {
        indent -= 4;
        lines.push(`${' '.repeat(indent)}</Provider>`);
    }

    indent -= 4;
    lines.push(`${' '.repeat(indent)}</ChaynsProvider>`);

    if (moduleFederation) {
        indent -= 4;
        lines.push(`${' '.repeat(indent)}</div>`);
    }

    if (moduleFederation && useRedux) {
        indent -= 4;
        lines.push(`${' '.repeat(indent)});`);
        lines.push('};');
    } else {
        lines.push(');');
    }

    lines.push('');
    if (moduleFederation) {
        lines.push('export default withCompatMode(AppWrapper);')
    } else {
        lines.push('export default AppWrapper;');
    }
    lines.push('');

    return lines.join('\n');
}