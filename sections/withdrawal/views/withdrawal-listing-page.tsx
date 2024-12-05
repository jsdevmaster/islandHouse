import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AdminWithdrawalTable from '../withdrawal-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Withdrawal', link: '/main/withdrawal' }
];

type TEmployeeListingPage = {};

export default async function WithdrawalListingPage({}: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Withdrawal`} description="" />
        </div>
        <Separator />
        <AdminWithdrawalTable />
      </div>
    </PageContainer>
  );
}
