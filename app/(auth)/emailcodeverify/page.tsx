import { EmailCodeVerifyPageView } from '@/sections/emailcodeverify/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Island House',
  description: ''
};

export default function Page() {
  return <EmailCodeVerifyPageView />;
}
