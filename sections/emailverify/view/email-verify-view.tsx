import { Metadata } from 'next';
import EmailVerifySendPage from '../email-verify';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function EmailVerifyPage() {
  return (
    <>
      <EmailVerifySendPage />
    </>
  );
}
