import { ChaynsProvider, type ChaynsProviderProps, withCompatMode } from 'chayns-api';
import { PageProvider } from '@chayns-components/core';
import App from './App';

const AppWrapper = (props: ChaynsProviderProps) => (
    <div className="{{ package-name-underscore }}">
        <ChaynsProvider {...props}>
            <PageProvider>
                <App />
            </PageProvider>
        </ChaynsProvider>
    </div>
);

export default withCompatMode(AppWrapper);
