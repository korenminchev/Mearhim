import { listingPageSize } from "@/src/common/constants";
import { Listing } from "@/src/common/models/listing";
import { ProtectedSpaceType } from "@/src/common/models/protected_space";
import supabase from "./supabase/client";

// A function to fetch all listings from the database.
export const fetchListings = async (
  page: number,
  capacity: number,
  city: string,
  protectedSpaces: ProtectedSpaceType[],
  petsFriendly: boolean | null,
  petsExisting: boolean | null,
  disabledAccessibility: boolean | null,
  kosher: boolean | null,
  lastHour: boolean | null
) => {
  // Start building the query.
  let query = supabase
    .from("listings")
    .select("*")
    .eq("active", true)
    .gte("capacity", capacity)
    .ilike("city", `%${city}%`);

  if (protectedSpaces !== undefined && protectedSpaces !== null && protectedSpaces.length >= 1) {
    query = query.in("protectedSpace", protectedSpaces);
  }

  if (petsFriendly !== null) {
    query = query.eq("petsFriendly", petsFriendly);
  }

  if (petsExisting !== null) {
    query = query.eq("petsExisting", petsExisting);
  }

  if (disabledAccessibility !== null) {
    query = query.eq("disabledAccessibility", disabledAccessibility);
  }

  if (kosher !== null) {
    query = query.eq("kosher", kosher);
  }

  // Ordering and pagination.
  query = query
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(page * listingPageSize, (page + 1) * listingPageSize - 1);

  
  if (lastHour) {
    const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
    query = query.gte("created_at", oneHourAgo.toISOString());
  }

  // Execute the query.
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
};

// A function to create a new listing in the database.
export const createListing = async (listing: Listing) => {
  const isValid = () =>
    !(
      listing.name == "" ||
      listing.phone == "" ||
      listing.city == "" ||
      listing.protectedSpace === null ||
      listing.protectedSpace === undefined ||
      listing.petsFriendly === null ||
      listing.petsFriendly === undefined ||
      listing.petsExisting === null ||
      listing.petsExisting === undefined ||
      listing.disabledAccessibility === null ||
      listing.disabledAccessibility === undefined ||
      listing.kosher === null ||
      listing.kosher === undefined
    );

  // Trim whitespace from the listing string fields
  listing.name = listing.name.trim();
  listing.phone = listing.phone.trim();
  listing.city = listing.city.trim();
  listing.description = listing.description.trim();
  listing.protectedSpace = listing.protectedSpace ?? "NONE";
  listing.petsFriendly = listing.petsFriendly ?? false;
  listing.petsExisting = listing.petsExisting ?? false;
  listing.disabledAccessibility = listing.disabledAccessibility ?? false;
  listing.kosher = listing.kosher ?? false;

  // Setting default values for the listing
  listing.active = true;
  listing.pinned = false;

  // Validate the listing
  if (!isValid()) {
    throw new Error("Invalid listing provided");
  }

  // Add the listing to the database
  const { data, error } = await supabase.from("listings").insert([listing]);
  if (error) {
    throw error;
  }
};

// A function to get a listing from the database by its id.
export const getListing = async (id: string) => {
  const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();

  if (error) {
    throw error;
  }

  return data;
};

// A function to increment the phoneClickedCounter field of a listing.
export const incrementListingPhoneClickedCounter = async (id: number) => {
  try {
    const { data, error } = await supabase.rpc("increment_phone_counter", { listing_id: id });
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};
