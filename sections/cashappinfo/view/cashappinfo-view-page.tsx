import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import CashAppInfoPageView from '../cashapp-fron';

const breadcrumbItems = [
  { title: 'Main', link: '/main' },
  { title: 'Payment Setting', link: '/main/cashappinfo' }
];
export default function CashAppInfoPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <CashAppInfoPageView />
      </div>
    </PageContainer>
  );
}
