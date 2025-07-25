import LoginForm from '@/components/auth/LoginForm';
export default function AdminLogin() {
  return <LoginForm isAdminLogin={true} redirectPath="/hatsadmin/dashboard" />;
}
