import express from "express";
import * as userController from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/validate", authenticateToken, userController.validate);
router.get("/me", authenticateToken, userController.getMe);
router.put("/me", authenticateToken, userController.updateMe);
router.post("/logout", userController.logout);

export default router;
