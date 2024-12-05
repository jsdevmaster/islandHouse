import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const POST = async (request: NextRequest) => {
  const { email, code } = await request.json();

  try {
    // Define the email message
    const msg = {
      to: email, // recipient email
      from: process.env.EMAIL_USER as string, // sender email registered with SendGrid
      subject: 'Your Verification Code',
      text: 'Your verification code is below',
      html: `<strong>Your verification code is: ${code}</strong>` // Optional: HTML version of the message
    };

    // Send the email
    await sgMail.send(msg);
    // Send success response
    return NextResponse.json(
      { message: 'Verification email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
};
