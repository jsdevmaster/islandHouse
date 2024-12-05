import { EmailVerifyPage } from '@/sections/emailverify/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Island House',
  description: ''
};

export default function Page() {
  return <EmailVerifyPage />;
}
