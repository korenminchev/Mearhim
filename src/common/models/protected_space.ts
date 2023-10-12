export type ProtectedSpaceType =
  | "MAMAD"
  | "MIKLAT"
  | "MIGUNIT"
  | "HEDER_MADREGOT"
  | "NONE";

// A dictionary that maps the protected space type to a human readable string
export const protectedSpaceTypeToHebrew: Record<ProtectedSpaceType, string> = {
  MAMAD: 'ממ"ד',
  MIKLAT: "מקלט",
  MIGUNIT: "מיגונית",
  HEDER_MADREGOT: "חדר מדרגות",
  NONE: "ללא",
};

export function protectedSpaceTypeToHebrewString(
  protectedSpaceType: ProtectedSpaceType | null
): string {
  if (protectedSpaceType === null || protectedSpaceType === undefined) {
    return "לא ידוע";
  }

  return protectedSpaceTypeToHebrew[protectedSpaceType];
}
