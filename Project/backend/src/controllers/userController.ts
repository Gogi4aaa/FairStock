import { Response } from "express";
import * as userService from "../services/userService";
import { authenticateToken, AuthRequest } from "../middleware/auth";

export const register = async (req: any, res: Response) => {
  const { username, password, email, fullName } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }
  const result = await userService.register(username, password, email, fullName);
  if (!result.success) {
    return res.status(result.status).json({ message: result.message });
  }
  res.status(201).json({ message: "Registration successful." });
};

export const login = async (req: any, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }
  
  const result = await userService.login(username, password);
  if (!result.success) {
    return res.status(401).json({ message: result.message || "Invalid credentials." });
  }
  
  // Return JWT token and user data
  res.json({ 
    message: "Login successful.", 
    token: result.token,
    user: result.user
  });
};

export const validate = async (req: AuthRequest, res: Response) => {
  try {
    // Token is already validated by authenticateToken middleware
    if (!req.user) {
      return res.json({ authenticated: false });
    }

    // Get full user data from database
    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      return res.json({ authenticated: false });
    }

    res.json({ 
      authenticated: true, 
      username: user.username,
      userId: user.id,
      user: user
    });
  } catch (error) {
    res.json({ authenticated: false });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await userService.updateUser(req.user.userId, req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Update failed" });
    }

    res.json({ message: "Profile updated successfully", user: result.user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const logout = (req: any, res: Response) => {
  // JWT tokens are stateless, so logout is handled client-side by removing the token
  // No server-side action needed
  res.json({ message: "Logout successful." });
};

