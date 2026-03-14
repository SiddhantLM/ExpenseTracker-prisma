import axios from "axios";

const BASE_URL = "https://api.textbee.dev/api/v1";
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

export const sendOtpSms = async (phone: string, otp: string) => {
  try {
    await axios.post(
      `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
      {
        recipients: [phone],
        message: `Your OTP is ${otp}. OTP is valid for 10 minutes.`,
      },
      { headers: { "x-api-key": API_KEY } },
    );
    return true;
  } catch (error) {
    return false;
  }
};
