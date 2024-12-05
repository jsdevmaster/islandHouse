import RoleMiddleware from '@/components/rolemiddleware';
import { CashAppInfoPage } from '@/sections/cashappinfo/view';
import { SearchParams } from 'nuqs/parsers';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Island House'
};

export default async function Page({ searchParams }: pageProps) {
  return (
    <RoleMiddleware accessRight="admin">
      <CashAppInfoPage />
    </RoleMiddleware>
  );
}
