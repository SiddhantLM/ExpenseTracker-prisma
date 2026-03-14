import { Request, Response } from "express";
import Prisma from "../lib/prisma.js";
import { sendOtp } from "../utils/mailer.js";
import { sendOtpSms } from "../utils/sms.js";
import jwt from "jsonwebtoken";

interface LoginRequestBody {
  phone?: string;
  email?: string;
  otp: string;
}

interface RegisterRequestBody {
  phone?: string;
  email?: string;
}

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
) => {
  try {
    const { phone, email } = req.body;

    if (phone == null && email == null) {
      return res.status(400).json({
        message: "Phone number or email required.",
      });
    }

    let existingUser;

    existingUser = email
      ? await Prisma.user.findUnique({
          where: { email: email },
        })
      : await Prisma.user.findUnique({
          where: { phone: phone },
        });

    if (!existingUser) {
      existingUser = await Prisma.user.create({
        data: {
          email: email,
          phone: phone,
        },
      });
    }

    const uniqueOtp = String(Math.floor(100000 + Math.random() * 900000));

    let sent = null;
    if (email) {
      sent = await sendOtp(uniqueOtp, email);
    } else if (phone) {
      sent = await sendOtpSms(phone, uniqueOtp);
    }

    if (!sent) {
      return res.status(500).json({
        message: "Could not deliver the OTP. Try again later.",
      });
    }

    const otp = await Prisma.otp.create({
      data: {
        otp: uniqueOtp,
        validBy: new Date(Date.now() + 1000 * 60 * 10),
        userId: existingUser.id,
      },
    });

    return res.status(200).json({
      message: "OTP sent successfully.",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "Internal server error. Try again later",
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
) => {
  try {
    const { phone, email, otp } = req.body;

    if (phone == null && email == null) {
      return res.status(400).json({
        message: "Phone number or email required.",
      });
    }

    const existingUser = email
      ? await Prisma.user.findUnique({
          where: { email: email },
        })
      : await Prisma.user.findUnique({
          where: { phone: phone },
        });

    if (!existingUser) {
      return res.json({
        status: 500,
        message: "User not found.",
      });
    }

    const otpRecord = await Prisma.otp.findFirst({
      where: { userId: existingUser.id },
    });

    if (otp !== otpRecord?.otp) {
      return res.status(500).json({
        message: "OTP invalid.",
      });
    }

    if (new Date(otpRecord.validBy) < new Date()) {
      return res.status(500).json({
        message: "OTP expired.",
      });
    }

    const token = await jwt.sign(
      {
        id: existingUser.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Logged in successfully.",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: 500,
      message: "Internal server error. Try again later",
    });
  }
};
