import { Metadata } from 'next';
import EmailCodeVerifyPage from '../email-verify';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function EmailCodeVerifyPageView() {
  return (
    <>
      <EmailCodeVerifyPage />
    </>
  );
}
