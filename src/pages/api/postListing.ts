import type { NextApiRequest, NextApiResponse } from "next";

import { Listing, isJsonValidListing } from "@/src/common/models/listing";
import { createListing } from "@/src/server/database/database";

type ResponseData = {
  listing: Listing | null;
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Validate the request method
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
      success: false,
      listing: null,
    });
  }

  // Validate the request body
  console.log(req.body);
  if (!isJsonValidListing(req.body)) {
    return res.status(400).json({
      message: "Invalid listing data",
      success: false,
      listing: null,
    });
  }

  // Add the listing to the database
  await createListing(req.body)
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Error creating listing",
        success: false,
        listing: null,
      });
    })
    .then(() => {
      return res.status(200).json({
        message: "",
        success: true,
        listing: req.body,
      });
    });
}
