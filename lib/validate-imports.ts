// TypeScript Import Validation
// This file validates that all imports are working correctly

import { customerService } from '@/lib/services/customer-service';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

// Test that the imports resolve correctly
console.log('✅ Customer service imported:', typeof customerService);
console.log('✅ Firebase verify imported:', typeof verifyFirebaseUser);

// Export for module resolution test
export const validateImports = () => {
  return {
    customerService: !!customerService,
    verifyFirebaseUser: !!verifyFirebaseUser,
  };
};

export default validateImports;
