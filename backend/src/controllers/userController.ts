import { Request, Response } from "express";
import * as userService from "../services/userService";

export const register = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }
  const result = userService.register(username, password);
  if (!result.success) {
    return res.status(result.status).json({ message: result.message });
  }
  res.status(201).json({ message: "Registration successful." });
};

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  const success = userService.login(username, password);
  if (!success) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  res.json({ message: "Login successful." });
};



