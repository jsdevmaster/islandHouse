import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserTable from '../user-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'User', link: '/main/user' }
];

type TEmployeeListingPage = {};

export default async function UserListingPage({}: TEmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`User Info List`} description="" />
        </div>
        <Separator />
        <UserTable />
      </div>
    </PageContainer>
  );
}
