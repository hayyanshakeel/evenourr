// app/opengraph-image.tsx

import OpengraphImage from 'components/opengraph-image';
// FIX: Corrected the import path to use the '@/' alias
import LogoIcon from '@/components/icons/logo';

export default async function Image() {
  return await OpengraphImage();
}