import clsx from 'clsx';

const Price = ({
  className,
  amount,
  currencyCode = 'INR'
}: {
  className?: string;
  amount: string;
  currencyCode: string;
}) => {
  // This uses the Internationalization API to format the price
  // correctly based on the currency code provided by Shopify (e.g., USD, INR).
  // The 'en-IN' locale helps format numbers with commas correctly for currencies like Rupees.
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  }).format(parseFloat(amount));

  return (
    <p className={clsx('text-2xl font-bold text-black', className)}>
      {formattedPrice}
    </p>
  );
};

export default Price;