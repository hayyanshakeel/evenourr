import { ReadonlyURLSearchParams } from 'next/navigation';
import React from 'react';

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const validateContext = <T>(context: React.Context<T | undefined>): T => {
  const contextValue = React.useContext(context);
  if (contextValue === undefined) {
    throw new Error('context must be used within a Provider');
  }
  return contextValue;
};

export const absoluteUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';
  return `${baseUrl}${path}`;
};
