import { performance } from 'perf_hooks';
import { User } from '../../models/entities/user';
import endpoints from './endpoints';
import { ApiError } from './error';
import { apiLogger } from './logger';

const accessDenied = {
	message: 'Access denied.',
	code: 'ACCESS_DENIED',
	id: '56f35758-7dd5-468b-8439-5d6fb8ec9b8e'
};

export default async (endpoint: string, user: User | null | undefined, data: any, file?: any) => {
	const ep = endpoints.find(e => e.name === endpoint);

	if (ep == null) {
		throw new ApiError({
			message: 'No such endpoint.',
			code: 'NO_SUCH_ENDPOINT',
			id: 'f8080b67-5f9c-4eb7-8c18-7f1eeae8f709',
			httpStatusCode: 404
		});
	}

	if (ep.meta.requireCredential && user == null) {
		throw new ApiError({
			message: 'Credential required.',
			code: 'CREDENTIAL_REQUIRED',
			id: '1384574d-a912-4b81-8601-c7b1c4085df1',
			httpStatusCode: 401
		});
	}

	if (ep.meta.requireCredential && user!.isSuspended) {
		throw new ApiError(accessDenied, { reason: 'Your account has been suspended.' });
	}

	if (ep.meta.requireAdmin && !user!.isAdmin) {
		throw new ApiError(accessDenied, { reason: 'You are not the admin.' });
	}

	// API invoking
	const before = performance.now();
	return await ep.exec(data, user, file).catch((e: Error) => {
		if (e instanceof ApiError) {
			throw e;
		} else {
			apiLogger.error(`Internal error occurred in ${ep.name}`, {
				ep: ep.name,
				ps: data,
				e: {
					message: e.message,
					code: e.name,
					stack: e.stack
				}
			});
			throw new ApiError(null, {
				e: {
					message: e.message,
					code: e.name,
					stack: e.stack
				}
			});
		}
	}).finally(() => {
		const after = performance.now();
		const time = after - before;
		if (time > 1000) {
			apiLogger.warn(`SLOW API CALL DETECTED: ${ep.name} (${time}ms)`);
		}
	});
};
