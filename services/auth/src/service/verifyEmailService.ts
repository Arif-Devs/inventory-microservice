import prisma from '@/config/prisma';
import { EmailVerificationSchema } from '@/schema';
import axios from 'axios';
import { EMAIL_SERVICE } from '../config/db';

export const verifyEmailService = async (body: any) => {
  // Validate the request body
  const parsedBody = EmailVerificationSchema.safeParse(body);
  if (!parsedBody.success) {
    return { error: parsedBody.error.errors };
  }

  // check if the user with email exists
  const user = await prisma.user.findUnique({
    where: { email: parsedBody.data.email },
  });
  if (!user) {
    return { message: 'User not found' };
  }

  // find the verification code
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      userId: user.id,
      code: parsedBody.data.code,
    },
  });
  if (!verificationCode) {
    return { message: 'Invalid verification code' };
  }

  // if the code has expired
  if (verificationCode.expiresAt < new Date()) {
    return { message: 'Verification code expired' };
  }

  // update user status to verified
  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, status: 'ACTIVE' },
  });

  // update verification code status to used
  await prisma.verificationCode.update({
    where: { id: verificationCode.id },
    data: { status: 'USED', verifiedAt: new Date() },
  });

  // send success email
  await axios.post(`${EMAIL_SERVICE}/emails/send`, {
    recipient: user.email,
    subject: 'Email Verified',
    body: 'Your email has been verified successfully',
    source: 'verify-email',
  });

  return { message: 'Email verified successfully' };
};
