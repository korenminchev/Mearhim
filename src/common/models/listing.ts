import { ProtectedSpaceType } from "@/src/common/models/protected_space";

export type Listing = {
  id: number;
  name: string;
  city: string;
  capacity: number;
  description: string;
  phone: string;
  active: boolean;
  pinned: boolean;
  protectedSpace: ProtectedSpaceType | null;
  petsFriendly: boolean | null;
  petsExisting: boolean | null;
  disabledAccessibility: boolean | null;
  kosher: boolean | null;
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
    typeof data.pinned === "undefined" &&
    typeof data.protectedSpace === "string" &&
    typeof data.petsFriendly === "boolean" &&
    typeof data.petsExisting === "boolean" &&
    typeof data.disabledAccessibility === "boolean" &&
    typeof data.kosher === "boolean"
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
