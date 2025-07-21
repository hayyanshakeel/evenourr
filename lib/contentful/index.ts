import { createClient, Entry } from 'contentful';

const space = process.env.CONTENTFUL_SPACE_ID || '';
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN || '';
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!space || !accessToken) {
  throw new Error('Contentful space ID and access token must be provided in environment variables.');
}

const client = createClient({
  space,
  accessToken,
  environment,
});

export async function fetchEntries<T>(contentType: string): Promise<Entry<T>[]> {
  const entries = await client.getEntries<T>({ content_type: contentType });
  return entries.items;
}
