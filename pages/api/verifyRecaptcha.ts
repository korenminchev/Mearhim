import type { NextApiRequest, NextApiResponse } from "next";

const verifyRecaptcha = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const recaptchaValue = req.body.recaptchaValue;
  const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
  console.log(SECRET_KEY);

  if (!SECRET_KEY) {
    return res
      .status(500)
      .json({ error: "RECAPTCHA_SECRET_KEY is not defined" });
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${SECRET_KEY}&response=${recaptchaValue}`,
    }
  );

  const data = await response.json();
  console.log(data);

  if (data.success) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};

export default verifyRecaptcha;
