import { SignUpViewPage } from '@/sections/signup/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Island House',
  description: ''
};

export default function Page() {
  return <SignUpViewPage />;
}
