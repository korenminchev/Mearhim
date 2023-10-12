import type { NextApiRequest, NextApiResponse } from "next";

import { Listing } from "@/src/common/models/listing";
import { fetchListings } from "@/src/server/database/database";
import { ProtectedSpaceType } from "@/src/common/models/protected_space";

type ResponseData = {
  listings: Array<Listing>;
  success: boolean;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
      success: false,
      listings: [],
    });
  }

  const parseBoolean = (value: string | string[] | undefined) => {
    if (value === "true") {
      return true;
    } else if (value === "false") {
      return false;
    }

    return null;
  };

  // convert req.query.page to number
  const page = Number(req.query.page) || 0;
  const capacity = Number(req.query.capacity) || 0;
  const city = String(req.query.city) || "";
  const petsFriendly = parseBoolean(req.query.petsFriendly);
  const petsExisting = parseBoolean(req.query.petsExisting);
  const disabledAccessibility = parseBoolean(req.query.disabledAccessibility);
  const kosher = parseBoolean(req.query.kosher);

  const protectedSpaces = Array<ProtectedSpaceType>();
  if (req.query.protectedSpace !== undefined) {
    if (typeof req.query.protectedSpace === "string") {
      protectedSpaces.push(req.query.protectedSpace as ProtectedSpaceType);
    } else {
      protectedSpaces.push(...(req.query.protectedSpace as ProtectedSpaceType[]));
    }
  }

  const listings = await fetchListings(
    page,
    capacity,
    city,
    protectedSpaces as ProtectedSpaceType[],
    petsFriendly,
    petsExisting,
    disabledAccessibility,
    kosher
  ).catch((error) => {
    console.log(error);
  });

  if (!listings) {
    return res.status(500).json({
      message: "Error fetching listings",
      success: false,
      listings: [],
    });
  }

  return res.status(200).json({ message: "", success: true, listings: listings });
}
