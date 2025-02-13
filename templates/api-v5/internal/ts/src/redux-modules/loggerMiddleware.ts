import { Middleware } from '@reduxjs/toolkit';
import logger from '../utils/logger';

type MetaAction = {
    type: string;
    payload: unknown;
    meta: {
        arg: unknown;
        requestId: string;
        requestStatus: 'pending' | 'rejected' | 'fulfilled';
        aborted?: boolean;
        condition?: boolean;
    };
    error?: Error;
};

export const loggerMiddleware: Middleware = () => (next) => (action) => {
    try {
        const metaAction = action as MetaAction;
        if (metaAction?.meta?.requestStatus === 'rejected') {
            if (metaAction.meta.aborted || metaAction.meta.condition) {
                return next(action);
            }
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
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
            // eslint-disable-next-line no-console
            console.warn('error in store', action);
        }
        logger.error(
            {
                message: 'error in store',
                data: {
                    action,
                },
            },
            ex as Error,
        );
    }
    return undefined;
};
