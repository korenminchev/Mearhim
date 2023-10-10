import type { NextApiRequest, NextApiResponse } from "next";

import { Listing, isJsonValidListings } from "@/src/common/models/listing";
import { fetchListings } from "@/src/server/database/database";

type ResponseData = {
  listings: Array<Listing>;
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
      success: false,
      listings: [],
    });
  }

  const listings = await fetchListings().catch((error) => {
    console.log(error);
  });

  if (!listings) {
    return res.status(500).json({
      message: "Error fetching listings",
      success: false,
      listings: [],
    });
  }

  return res
    .status(200)
    .json({ message: "", success: true, listings: listings });
}
