import { NextFunction, Request, Response } from 'express';
import { sendContactMessage, type ContactPayload } from '../services/mailService';

export async function submitContact(
  req: Request<{}, {}, ContactPayload>,
  res: Response,
  next: NextFunction
) {
  try {
    await sendContactMessage(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
