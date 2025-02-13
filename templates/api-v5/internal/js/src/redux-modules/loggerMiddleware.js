import logger from '../utils/logger';

export const loggerMiddleware = () => (next) => (action) => {
    try {
        const metaAction = action;
        if (metaAction?.meta?.requestStatus === 'rejected') {
            if (metaAction.meta.aborted || metaAction.meta.condition) {
                return next(action);
            }
            if (process.env.NODE_ENV === 'development') {
                console.warn('redux action error', action);
            }
            logger.error(
                {
                    message: 'redux action error',
                    customText: metaAction.type,
                    data: { arg: metaAction.meta.arg },
                    section: 'redux-modules/loggerMiddleware',
                },
                metaAction.error,
            );
        }
        return next(action);
    } catch (ex) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('error in store', action);
        }
        logger.error(
            {
                message: 'error in store',
                data: {
                    action,
                },
            },
            ex,
        );
    }
    return undefined;
};
