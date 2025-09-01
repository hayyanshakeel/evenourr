// TypeScript Import Validation
// This file validates that all imports are working correctly

import { customerService } from '@/lib/services/customer-service';
import { requireEVRAdmin } from '@/lib/enterprise-auth';

// Test that the imports resolve correctly
console.log('✅ Customer service imported:', typeof customerService);
console.log('✅ EVR verify imported:', typeof requireEVRAdmin);

// Export for module resolution test
export const validateImports = () => {
  return {
    customerService: !!customerService,
    requireEVRAdmin: !!requireEVRAdmin,
  };
};

export default validateImports;
