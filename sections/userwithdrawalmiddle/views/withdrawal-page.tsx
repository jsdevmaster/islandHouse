import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserredeemMiddle from '../withdrawal-fron';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Withdrawal', link: '/mypage/withdrawal' },
  { title: 'Middle', link: '/mypage/withdrawal/withdrawalmiddle' }
];

type TEmployeeListingPage = {};

export default async function UserWithdrawalMiddlePage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Withdrawal`} description="" />
        </div>
        <Separator />
        <UserredeemMiddle />
      </div>
    </PageContainer>
  );
}
