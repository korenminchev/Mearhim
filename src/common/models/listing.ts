export type Listing = {
  id: number;
  name: string;
  city: string;
  capacity: number;
  description: string;
  phone: string;
  active: boolean;
  pinned: boolean;
};

export function isJsonValidListing(data: any): data is Listing {
  return (
    typeof data.id === "undefined" &&
    typeof data.name === "string" &&
    typeof data.city === "string" &&
    typeof data.capacity === "number" &&
    typeof data.description === "string" &&
    typeof data.phone === "string" &&
    typeof data.active === "undefined" &&
    typeof data.pinned === "undefined"
  );
}

export function isModelValidListing(data: any): data is Listing {
  return (
    typeof data.name === "string" &&
    typeof data.city === "string" &&
    typeof data.capacity === "number" &&
    typeof data.description === "string" &&
    typeof data.phone === "string" &&
    typeof data.active === "boolean" &&
    typeof data.pinned === "boolean"
  );
}

export function isJsonValidListings(data: any): data is Listing[] {
  return Array.isArray(data) && data.every(isJsonValidListing);
}
