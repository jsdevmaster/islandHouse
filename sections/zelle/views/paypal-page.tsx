import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserPaypal from '../zelle-fron';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Deposit', link: '/mypage/deposit' },
  { title: 'Zelle', link: '/mypage/deposit/zelle' }
];

type TEmployeeListingPage = {};

export default async function UserZellePage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Zelle`} description="" />
        </div>
        <Separator />
        <UserPaypal />
      </div>
    </PageContainer>
  );
}
