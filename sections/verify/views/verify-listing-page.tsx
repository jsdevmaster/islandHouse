import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import VerifyTable from '../verify-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Verify', link: '/main/verify' }
];

type TEmployeeListingPage = {};

export default async function VerifyListingPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Code Verify`} description="" />
        </div>
        <Separator />
        <VerifyTable />
      </div>
    </PageContainer>
  );
}
