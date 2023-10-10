import { Listing } from "../../common/models/listing";
import supabase from "./supabase/client";

// A function to fetch all listings from the database.
export const fetchListings = async () => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("active", true);

  if (error) {
    throw error;
  }

  return data;
};

// A function to create a new listing in the database.
export const createListing = async (listing: Listing) => {
  const isValid = () =>
    !(listing.name == "" || listing.phone == "" || listing.city == "");

  // Trim whitespace from the listing string fields
  listing.name = listing.name.trim();
  listing.phone = listing.phone.trim();
  listing.city = listing.city.trim();
  listing.description = listing.description.trim();

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
