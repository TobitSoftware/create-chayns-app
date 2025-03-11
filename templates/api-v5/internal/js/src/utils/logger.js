import { getCurrentPage, getSite, getUser } from 'chayns-api';
import { ChaynsLogger } from 'chayns-logger';

const logger = new ChaynsLogger({
    // TODO: create and insert your applicationUid
    applicationUid: '<applicationUid>',
    overrideOnError: true,
    overrideConsoleError: process.env.NODE_ENV !== 'development',
    useDevServer:
        process.env.NODE_ENV === 'development' ||
        ['qa', 'development'].includes(process.env.BUILD_ENV),
    version: process.env.BUILD_VERSION,
    throttleTime: 1000,
    middleware: (payload) => {
        try {
            const currentPage = getCurrentPage();
            // eslint-disable-next-line no-param-reassign
            payload.siteId ??= currentPage.siteId;
            // eslint-disable-next-line no-param-reassign
            payload.pageId ??= currentPage.id;
            // eslint-disable-next-line no-param-reassign
            payload.personId ??= getUser()?.personId;
            // eslint-disable-next-line no-param-reassign
            payload.locationId ??= getSite().locationId;
        } catch {
            //
        }

        return true;
    },
});

export default logger;
