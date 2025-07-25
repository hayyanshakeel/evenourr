import OpengraphImage from 'components/opengraph-image';

export default async function Image({
  params
}: {
  params: { collection: string };
}) {
  const title = params.collection.charAt(0).toUpperCase() + params.collection.slice(1);

  return await OpengraphImage({ title });
}
