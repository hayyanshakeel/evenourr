import LoginForm from '@/components/auth/LoginForm';
export default function UserLogin() {
  return <LoginForm isAdminLogin={false} redirectPath="/" />;
}
