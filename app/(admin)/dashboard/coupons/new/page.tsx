import Header from '@/components/admin/header';
import CouponForm from '@/components/admin/forms/coupon-form';

export default function NewCouponPage() {
  return (
    <div>
      <Header title="Create Coupon" />
      <div className="mt-8">
        <CouponForm />
      </div>
    </div>
  );
}
