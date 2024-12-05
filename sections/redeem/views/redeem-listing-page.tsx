import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AdminRedeemTable from '../redeem-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Deposit', link: '/main/redeem' }
];

type TEmployeeListingPage = {};

export default async function RedeemListingPage({}: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Deposit`} description="" />
        </div>
        <Separator />
        <AdminRedeemTable />
      </div>
    </PageContainer>
  );
}
