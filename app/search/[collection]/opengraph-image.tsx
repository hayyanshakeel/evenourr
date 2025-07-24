import OpengraphImage from 'components/opengraph-image';
import { getCollection } from 'lib/shopify';

export default async function Image({
  params
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const collectionData = await getCollection(collection);
  const title = collectionData?.title || 'Collection';

  return await OpengraphImage({ title });
}
