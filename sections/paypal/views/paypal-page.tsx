import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserPaypal from '../paypal-fron';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Deposit', link: '/mypage/deposit' },
  { title: 'Paypal', link: '/mypage/deposit/paypal' }
];

type TEmployeeListingPage = {};

export default async function UserPaypalPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Paypal`} description="" />
        </div>
        <Separator />
        <UserPaypal />
      </div>
    </PageContainer>
  );
}
