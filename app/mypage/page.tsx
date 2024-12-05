import RoleMiddleware from '@/components/rolemiddleware';
import { Promotion } from '@/sections/promotion/views';

export const metadata = {
  title: 'Island House'
};

export default function page() {
  return (
    <RoleMiddleware accessRight="user">
      <Promotion />
    </RoleMiddleware>
  );
}
