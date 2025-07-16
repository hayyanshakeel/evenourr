import clsx from 'clsx';

const Price = ({
  className,
  amount,
  currencyCode = 'USD'
}: {
  className?: string;
  amount: string;
  currencyCode: string;
}) => {
  // Use Intl.NumberFormat for proper currency formatting.
  // We'll use 'en-IN' for Indian Rupee formatting (₹) with commas.
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  }).format(parseFloat(amount));

  return (
    <p suppressHydrationWarning={true} className={className}>
      {formattedPrice}
    </p>
  );
};

export default Price;