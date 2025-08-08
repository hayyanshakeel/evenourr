import { useAuth } from '@/components/auth/AuthContext';

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export function useUser() {
  const { user: firebaseUser, loading } = useAuth();

  // Transform Firebase user to our user format
  const user: UserData | null = firebaseUser ? {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || undefined,
    firstName: firebaseUser.displayName?.split(' ')[0] || undefined,
    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || undefined,
  } : null;

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
}
