import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserWithdrawalForm from '../withdrawal-tables/user-withrawal-fron';
import UserWithdrawalTable from '../withdrawal-tables';
import { GameLink } from '../withdrawal-tables/game-link';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Withdrawal', link: '/mypage/withdrawal' }
];

type TEmployeeListingPage = {};

export default async function UserWithdrawalListingPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Withdrawal`} description="" />
        </div>
        <Separator />
        <UserWithdrawalForm />
        <p className="text-medium py-5 text-center font-bold">
          Withdrawal History
        </p>
        <UserWithdrawalTable />
        <GameLink />
      </div>
    </PageContainer>
  );
}
