import clsx from 'clsx';

const Price = ({
  className,
  amount,
  compareAtAmount, // Add the new property here
  currencyCode = 'USD'
}: {
  className?: string;
  amount: string;
  compareAtAmount?: string; // And define its type here (optional string)
  currencyCode: string;
}) => {
  const price = parseFloat(amount);
  const compareAtPrice = compareAtAmount ? parseFloat(compareAtAmount) : null;
  const isSale = compareAtPrice && compareAtPrice > price;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className={clsx('flex items-center gap-x-3', className)}>
      <span className="text-2xl font-bold text-black">{formatPrice(price)}</span>
      {isSale && compareAtPrice && (
        <>
          <span className="text-lg text-gray-500 line-through">{formatPrice(compareAtPrice)}</span>
          <span className="rounded-md bg-red-100 px-2 py-0.5 text-sm font-semibold text-red-600">
            {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}% OFF
          </span>
        </>
      )}
    </div>
  );
};

export default Price;