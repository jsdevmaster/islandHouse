import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserBitcoin from '../bitcoin-fron';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Deposit', link: '/mypage/deposit' },
  { title: 'Bitcoin', link: '/mypage/deposit/bitcoin' }
];

type TEmployeeListingPage = {};

export default async function UserBitcoinPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Bitcoin`} description="" />
        </div>
        <Separator />
        <UserBitcoin />
      </div>
    </PageContainer>
  );
}
