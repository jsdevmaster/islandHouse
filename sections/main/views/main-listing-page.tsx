import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import AdminMainTablePage from '../main-redeem-tables';
import AdminMainWithdrawalTablePage from '../main-withdrawal-tables';

const breadcrumbItems = [{ title: 'Main', link: '/main' }];

type TEmployeeListingPage = {};

export default async function MainListingPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Main`} description="" />
        </div>
        <Separator />
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminMainTablePage />
          <AdminMainWithdrawalTablePage />
        </div>
      </div>
    </PageContainer>
  );
}
