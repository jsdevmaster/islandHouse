import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AdminredeemHistoryTable from '../redeem-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Deposit', link: '/main/redeem' },
  { title: 'Deposit History', link: '/main/redeem/redeemhistory' }
];

type TEmployeeListingPage = {};

export default async function RedeemListingPage({}: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Deposit History`} description="" />
        </div>
        <Separator />
        <AdminredeemHistoryTable />
      </div>
    </PageContainer>
  );
}
