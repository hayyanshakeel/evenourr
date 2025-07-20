'use client';

import { NextStudio } from 'next-sanity/studio';
import sanityConfig from '@/app/studio/sanity.config'; // Using a new variable name here

export default function StudioPage() {
  // And using that new variable name here
  return <NextStudio config={sanityConfig} />;
}