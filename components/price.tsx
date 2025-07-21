'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

const Price = ({
  amount,
  className,
  currencyCode = 'USD',
  currencyCodeClassName
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => {
  const [formattedPrice, setFormattedPrice] = useState('');

  useEffect(() => {
    // Format price on client side to ensure consistency
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).format(parseFloat(amount));
    setFormattedPrice(formatted);
  }, [amount, currencyCode]);

  return (
    <p className={className}>
      {formattedPrice || `${currencyCode} ${amount}`}
      <span className={clsx('ml-2 inline', currencyCodeClassName)}>{`${currencyCode}`}</span>
    </p>
  );
};

export default Price;
