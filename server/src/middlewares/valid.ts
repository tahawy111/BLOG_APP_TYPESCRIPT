import { NextFunction, Request, Response } from "express";

export const validRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, account, password } = req.body;
  if (!name || !account || !password)
    return res.status(400).json({ msg: "Please fill inputs!" });
  const errors: string[] = [];
  if (!name) errors.push("Please add your name!");
  if (name.length > 20) {
    errors.push("Your name is up to 20 chars long.");
  }
  if (!account) errors.push("Please add your email or phone number!");
  if (!validPhone(account) && !validEmail(account)) {
    errors.push("Email or phone number format is incorrect.");
  }
  if (!password) {
    errors.push("Please add your password!");
  }
  if (password.length < 6) {
    errors.push("Password must be at least 6 chars.");
  }

  if (errors.length > 0) return res.status(400).json({ msg: errors });

  next();
};

export function validPhone(phone: string): boolean {
  const re: RegExp = /^[+]/g;
  return re.test(phone);
}
export function validEmail(email: string): boolean {
  const re: RegExp =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}
