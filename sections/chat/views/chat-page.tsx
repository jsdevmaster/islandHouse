import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UserChat from '../chat-fron';

const breadcrumbItems = [
  { title: 'MyPage', link: '/mypage' },
  { title: 'Chat', link: '/mypage/chat' }
];

type TEmployeeListingPage = {};

export default async function UserChatPage({}: TEmployeeListingPage) {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Chat`} description="" />
        </div>
        <Separator />
        <UserChat />
      </div>
    </PageContainer>
  );
}
