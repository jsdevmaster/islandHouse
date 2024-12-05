import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AdminWithdrawalHistoryTable from '../withdrawal-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Withdrawal', link: '/main/withdrawal' },
  { title: 'Withdrawal History', link: '/main/withdrawal/withdrawalhistory' }
];

type TEmployeeListingPage = {};

export default async function WithdrawalHistoryListingPage({}: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Withdrawal History`} description="" />
        </div>
        <Separator />
        <AdminWithdrawalHistoryTable />
      </div>
    </PageContainer>
  );
}
