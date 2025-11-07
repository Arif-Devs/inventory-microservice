import prisma from '../config/prisma';
import { UserCreateSchema } from '@/schema';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { EMAIL_SERVICE, USER_SERVICE } from '../config/db';

export const generateVerificationCode = () => {
  const timestamp = new Date().getTime().toString();
  const randomNum = Math.floor(10 + Math.random() * 90);
  let code = (timestamp + randomNum).slice(-5);

  return code; 
};

export const userRegistrationService = async (body: any) => {
  // Validate the request body
  const parsedBody = UserCreateSchema.safeParse(body);
  if (!parsedBody.success) {
    return { error: parsedBody.error.errors };
  }

  // check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: parsedBody.data.email,
    },
  });
  if (existingUser) {
    return { message: 'User already exists' };
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(parsedBody.data.password, salt);

  // create the auth user
  const user = await prisma.user.create({
    data: {
      ...parsedBody.data,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      verified: true,
    },
  });
  console.log('User created: ', user);

  // create the user profile by calling the user service
  await axios.post(`${USER_SERVICE}/users`, {
    authUserId: user.id,
    name: user.name,
    email: user.email,
  });

  // generate verification code
  const code = generateVerificationCode();
  await prisma.verificationCode.create({
    data: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    },
  });

  // send verification email
  await axios.post(`${EMAIL_SERVICE}/emails/send`, {
    recipient: user.email,
    subject: 'Email Verification',
    body: `Your verification code is ${code}`,
    source: 'user-registration',
  });

  return  {user} ;
};
