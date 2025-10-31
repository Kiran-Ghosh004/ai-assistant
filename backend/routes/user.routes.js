import express from 'express';
import { getCurrentUser, updateAssistant } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';  // ✅ Import your middleware
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

// Protect this route
userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);

export default userRouter;
