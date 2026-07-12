import { send } from "@emailjs/nodejs";

export async function sendVerificationEmail(
  toEmail: string,
  name: string,
  token: string
): Promise<void> {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await send(
    process.env.EMAILJS_SERVICE_ID as string,
    process.env.EMAILJS_TEMPLATE_ID as string,
    {
      to_name: name,
      to_email: toEmail,
      verify_link: verifyUrl,
    },
    {
      publicKey: process.env.EMAILJS_PUBLIC_KEY as string,
      privateKey: process.env.EMAILJS_PRIVATE_KEY as string, // required server-side
    }
  );
}