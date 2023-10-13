import type { NextApiRequest, NextApiResponse } from "next";

import { incrementListingPhoneClickedCounter } from "@/src/server/database/database";

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
      success: false,
    });
  }

  const listingId = Number(req.body.listingId);

  if (!listingId) {
    return res.status(400).json({
      message: "Missing listing id",
      success: false,
    });
  }

  try {
    await incrementListingPhoneClickedCounter(listingId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error incrementing listing phone clicked counter",
      success: false,
    });
  }

  return res.status(200).json({ message: "", success: true });
}
