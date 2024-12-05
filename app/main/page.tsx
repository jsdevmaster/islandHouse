import RoleMiddleware from '@/components/rolemiddleware';
import { MainListingPage } from '@/sections/main/views';

export const metadata = {
  title: 'Island House'
};

export default function page() {
  return (
    <RoleMiddleware accessRight="admin">
      <MainListingPage />
    </RoleMiddleware>
  );
}
