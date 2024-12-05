import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserredeemMiddle from '../redeem-fron';

const breadcrumbItems = [
  { title: 'Main', link: '/mypage' },
  { title: 'Depsit', link: '/mypage/deposit' },
  { title: 'Middle', link: '/mypage/deposit/middle' }
];

type TEmployeeListingPage = {};

export default async function UserredeemMiddlePage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Deposit`} description="" />
        </div>
        <Separator />
        <UserredeemMiddle />
      </div>
    </PageContainer>
  );
}
