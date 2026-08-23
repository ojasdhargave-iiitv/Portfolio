export type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export async function sendContactMessage(payload: ContactPayload) {
  // Replace with nodemailer or a transactional email service.
  return Promise.resolve({ received: payload });
}
