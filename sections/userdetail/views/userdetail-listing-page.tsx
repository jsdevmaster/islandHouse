import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserdetailTable from '../user-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'User', link: '/main/user' },
  { title: 'User Detail', link: '/main/user/userdetail' }
];

type TEmployeeListingPage = {};

export default async function UserdetailListingPage({}: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`User Details`} description="" />
        </div>
        <Separator />
        <UserdetailTable />
      </div>
    </PageContainer>
  );
}
