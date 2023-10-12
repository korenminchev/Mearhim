"use client";

import { Box, Text, Select, BoxProps } from "@chakra-ui/react";
import {
  ProtectedSpaceType,
  protectedSpaceTypeToHebrew,
} from "@/src/common/models/protected_space";

interface NullableBooleanFilter {
  label: string;
  value: boolean | null;
  onFilterChange: (value: boolean | null) => void;
  props?: BoxProps;
}

const NullableBooleanFilter: React.FC<NullableBooleanFilter> = ({
  label,
  value,
  onFilterChange,
  props,
}) => {
  const parseValue = (value: string) => {
    if (value === "") {
      return null;
    }

    return value === "true";
  };

  return (
    <Box {...props}>
      <Text mb={2} textAlign={"center"}>
        {" "}
        <b>{label}</b>
      </Text>
      <Select defaultValue={""} onChange={(e) => onFilterChange(parseValue(e.target.value))}>
        <option key="null" value={""} />

        <option key="true" value={"true"}>
          כן
        </option>

        <option key="false" value={"false"}>
          לא
        </option>
      </Select>
    </Box>
  );
};

export default NullableBooleanFilter;
