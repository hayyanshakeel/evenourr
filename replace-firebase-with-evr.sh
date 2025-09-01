#!/bin/bash

# Script to replace Firebase auth with EVR auth in API routes
# This will replace verifyFirebaseUser with requireEVRAdmin for admin routes

echo "🔄 Replacing Firebase authentication with EVR in API routes..."

# Find all TypeScript files in app/api directory
find app/api -name "*.ts" -type f | while read -r file; do
  if grep -q "verifyFirebaseUser" "$file"; then
    echo "Processing: $file"
    
    # Replace import statement
    sed -i '' 's/import { verifyFirebaseUser } from '\''@\/lib\/firebase-verify'\'';/import { requireEVRAdmin } from '\''@\/lib\/evr-verify'\'';/g' "$file"
    
    # Replace usage pattern
    sed -i '' 's/const result = await verifyFirebaseUser(request);/const verification = await requireEVRAdmin(request);/g' "$file"
    
    # Replace error handling
    sed -i '' 's/if (result\.error) {/if (!verification.isValid) {/g' "$file"
    sed -i '' 's/message: result\.error/message: '\''Authentication required'\''/g' "$file"
    sed -i '' 's/status: result\.status || 401/status: 401/g' "$file"
    
    # Replace user access
    sed -i '' 's/const user = result\.user;/const user = verification.user;/g' "$file"
    
    # Replace uid with id for EVR users
    sed -i '' 's/user\.uid/user.id/g' "$file"
    
    echo "✅ Updated: $file"
  fi
done

echo "🎉 Firebase to EVR replacement complete!"
