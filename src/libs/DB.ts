import { createClient } from '@libsql/client/web';

export const client = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL,
  authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN,
});
