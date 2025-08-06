import { baseUrl, validateEnvironmentVariables } from '@/lib/utils';
import { MetadataRoute } from 'next';

// Placeholder functions for products and collections (replace with your actual data sources)
const getProducts = async () => [];
const getCollections = async () => [];
const getPages = async () => [];

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  // Placeholder: returning empty arrays since Shopify integration is not set up
  const collectionsPromise = Promise.resolve([]);
  const productsPromise = Promise.resolve([]);
  const pagesPromise = Promise.resolve([]);

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
