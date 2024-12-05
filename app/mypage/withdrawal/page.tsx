import RoleMiddleware from '@/components/rolemiddleware';
import { searchParamsCache } from '@/lib/searchparams';
import UserWithdrawalListingPage from '@/sections/userwithdrawal/views/user-withdrawal-listing-page';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Island House'
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);

  return (
    <RoleMiddleware accessRight="user">
      <UserWithdrawalListingPage />
    </RoleMiddleware>
  );
}
