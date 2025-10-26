import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';  // ✅ Import your middleware

const userRouter = express.Router();

// Protect this route
userRouter.get("/current", isAuth, getCurrentUser);

export default userRouter;
