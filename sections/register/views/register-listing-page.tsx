import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import RegisterTable from '../register-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Register', link: '/main/register' }
];

type TEmployeeListingPage = {};

export default async function RegisterListingPage({}: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Register`} description="" />
        </div>
        <Separator />
        <RegisterTable />
      </div>
    </PageContainer>
  );
}
