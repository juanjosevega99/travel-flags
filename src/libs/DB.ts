import { createClient } from '@libsql/client/web';

import { DB_URL, AUTH_TOKEN } from '../../config';

if (!DB_URL || !AUTH_TOKEN) {
  throw new Error('Missing environment configuration.');
}

export const client = createClient({
  url: DB_URL,
  authToken: AUTH_TOKEN,
});
