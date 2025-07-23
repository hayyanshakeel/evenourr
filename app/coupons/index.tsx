'use client';

import { useEffect, useState } from 'react';
import { coupons as couponSchema } from '@/lib/db/schema'; // Import with alias

// Define the type based on your schema
type Coupon = typeof couponSchema.$inferSelect;

export default function CouponsList() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                // This would likely be an API call in a real app
                // For now, it's just showing how to use the type
                // const response = await fetch('/api/coupons/all'); 
                // const data = await response.json();
                // setCoupons(data);
            } catch (error) {
                console.error('Failed to fetch coupons', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    if (loading) return <p>Loading coupons...</p>;

    return (
        <div>
            <h2>All Coupons</h2>
            <ul>
                {coupons.map((coupon) => (
                    <li key={coupon.id}>{coupon.code}</li>
                ))}
            </ul>
        </div>
    );
}