import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({ message: "username already exists use another one" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "email already exists use another one" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "password must be atleast of 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      password: hashedPassword,
      email
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false
    });

    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({ message: `sign up error ${error}` });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false
    });

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: `login error ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `logout error: ${error}` });
  }
};

