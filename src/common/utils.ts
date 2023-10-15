export function nullableBooleanToHebrewString(value: boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return "לא ידוע";
  }

  return value ? "כן" : "לא";
}

export const isProduction = () => {
  console.log(process.env.NODE_ENV); 
  return process.env.NODE_ENV == "production";
}

