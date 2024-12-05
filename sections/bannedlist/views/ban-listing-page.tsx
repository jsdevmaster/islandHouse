import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import BanTable from '../ban-tables';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Banned List', link: '/main/bannedlist' }
];

type TEmployeeListingPage = {};

export default async function BanListingPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Banned List`} description="" />
        </div>
        <Separator />
        <BanTable />
      </div>
    </PageContainer>
  );
}
