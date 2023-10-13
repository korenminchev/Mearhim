"use client";

import { Listing, isModelValidListing } from "@/src/common/models/listing";
import { ProtectedSpaceType } from "@/src/common/models/protected_space";

// An API wrapper that fetches all of the listings from the backend
// and returns them as an array of Listing objects.
// API ROUTE: GET /api/getListings
export async function fetchListings(
  page: number,
  minimumCapacity: number,
  city: string,
  protectedSpace: ProtectedSpaceType[],
  petsFriendly: boolean | null,
  petsExisting: boolean | null,
  disabledAccessibility: boolean | null,
  kosher: boolean | null
): Promise<Array<Listing>> {
  let url = `/api/getListings?page=${page}&capacity=${minimumCapacity}&city=${city}`;

  for (const space of protectedSpace) {
    url += `&protectedSpace=${space}`;
  }

  if (petsFriendly !== null) {
    url += `&petsFriendly=${petsFriendly}`;
  }

  if (petsExisting !== null) {
    url += `&petsExisting=${petsExisting}`;
  }

  if (disabledAccessibility !== null) {
    url += `&disabledAccessibility=${disabledAccessibility}`;
  }

  if (kosher !== null) {
    url += `&kosher=${kosher}`;
  }

  const response = await fetch(url, {
    method: "GET",
  });

  const data = await response.json();
  if (!data.success) {
    console.error(data.message);
    return [];
  }

  return data.listings;
}

// An API wrapper that creates a new listing in the backend.
// Returns the newly created listing if successful, null otherwise.
// API ROUTE: POST /api/postListing
export async function createListing(listing: Listing): Promise<Listing> {
  const response = await fetch("/api/postListing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listing),
  });

  const data = await response.json();
  if (!data.success) {
    console.error(data.message);
    throw new Error(data.message);
  }

  if (!isModelValidListing(data.listing)) {
    console.error("Error in listing data", data.listing);
    throw new Error("Failed to validate listing from response");
  }

  return data.listing;
}

// An API wrapper that increments the phone clicked counter of a listing.
export async function incrementPhoneClickedCounter(listingId: number) {
  const response = await fetch("/api/incrementPhoneCounter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listingId }),
  });

  const data = await response.json();
  if (!data.success) {
    console.error(data.message);
    throw new Error(data.message);
  }
}
