import { createClient } from '@libsql/client/web';

const dbUrl = process.env.NEXT_PUBLIC_TURSO_DATABASE_URL;
const authToken = process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN;

if (!dbUrl || !authToken) {
  throw new Error('Missing environment configuration.');
}

export const client = createClient({
  url: dbUrl,
  authToken: authToken,
});
