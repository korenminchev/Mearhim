"use client";

import Select, { MultiValueProps, OnChangeValue, Props } from "react-select";

import { Box, Text, BoxProps } from "@chakra-ui/react";
import {
  ProtectedSpaceType,
  protectedSpaceTypeToHebrew,
} from "@/src/common/models/protected_space";

export interface ProtectedSpaceOption {
  readonly value: ProtectedSpaceType;
  readonly label: string;
}

export interface ProtectedPlaceFilterProps {
  protectedSpaces: ProtectedSpaceOption[];
  onFilterChange: (selectedOptions: OnChangeValue<ProtectedSpaceOption, true>) => void;
  props?: BoxProps;
}

const ProtectedSpaceFilter: React.FC<ProtectedPlaceFilterProps> = ({
  protectedSpaces,
  onFilterChange,
  props,
}) => {
  const options: readonly ProtectedSpaceOption[] = Object.entries(protectedSpaceTypeToHebrew).map(
    ([key, value]) => {
      return { value: key as ProtectedSpaceType, label: value };
    }
  );

  return (
    <Box {...props}>
      <Text mb={2} textAlign={"center"}>
        {" "}
        <b>🚨 מקום מוגן:</b>
      </Text>

      <Select isMulti={true} name="protectedSpace" options={options} onChange={onFilterChange} />
    </Box>
  );
};

export default ProtectedSpaceFilter;
