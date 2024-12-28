import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { InternalError } from "../errors/internal-error";

export const verifyError: ErrorRequestHandler = async (
  err: Error | InternalError,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (err instanceof InternalError) {
    const { code, message } = err;
    res.status(code).json({ message });
    return;
  }

  const { message } = err;
  console.error(message, {
    userIp: req.ip,
    status: 500,
    timestamp: new Date().toISOString(),
  });
  res.status(500).json({ message });
};
