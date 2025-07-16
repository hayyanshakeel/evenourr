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
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));

  return (
    // The component now only applies the className passed from its parent
    <p className={clsx(className)}>
      {formattedPrice}
    </p>
  );
};

export default Price;