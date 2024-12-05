import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserCashApp from '../cashapp-fron';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Deposit', link: '/mypage/deposit' },
  { title: 'CashApp', link: '/mypage/deposit/cashapp' }
];

type TEmployeeListingPage = {};

export default async function UserCashAppPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`CashApp`} description="" />
        </div>
        <Separator />
        <UserCashApp />
      </div>
    </PageContainer>
  );
}
