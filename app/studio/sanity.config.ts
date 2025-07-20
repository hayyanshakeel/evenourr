import { defineConfig } from 'sanity';
// --- FIX: Corrected import from 'sanity/structure' ---
// The `structureTool` has been renamed or is now accessed via the `structure` export.
import { structureTool } from 'sanity/structure';

// --- FIX: Corrected the path to your schemas ---
// I'm assuming your schemas are in a 'schemas' directory at the root of your project.
// If not, you'll need to adjust this path.
import { schemaTypes } from '../../schemas';

export default defineConfig({
  name: 'default',
  title: 'jsevenour',

  projectId: 'your-project-id', // Replace with your actual project ID
  dataset: 'production', // Replace with your dataset name

  plugins: [
    // --- FIX: Using the corrected import ---
    structureTool(),
  ],

  schema: {
    types: schemaTypes
  }
});