import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserVenmo from '../venmo-fron';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Deposit', link: '/mypage/deposit' },
  { title: 'Venmo', link: '/mypage/deposit/venmo' }
];

type TEmployeeListingPage = {};

export default async function UserVenmoPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Venmo`} description="" />
        </div>
        <Separator />
        <UserVenmo />
      </div>
    </PageContainer>
  );
}
