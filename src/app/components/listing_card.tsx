"use client";

import { Box, Heading, Text, Icon, Flex, Link, Spacer, Collapse } from "@chakra-ui/react";
import { PhoneIcon, AtSignIcon, TimeIcon } from "@chakra-ui/icons";
import { Listing } from "../../common/models/listing";
import CollapsibleWidget from "@/src/app/components/collapsible_widget";
import {
  protectedSpaceTypeToHebrew,
  protectedSpaceTypeToHebrewString,
} from "@/src/common/models/protected_space";
import { nullableBooleanToHebrewString } from "@/src/common/utils";

type ListingCardProps = {
  listing: Listing;
  backgroungColor?: string;
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing, backgroungColor }) => {
  return (
    <Box
      w={"100%"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      background={backgroungColor}
    >
      <Flex direction="row">
        <Box flex="2">
          <Text>
            <b>🏠 מארח:</b> {listing.name}
          </Text>
          <Text>
            <b>🏙️ ישוב:</b> {listing.city}
          </Text>
          <Text>
            <b>🧑‍🤝‍🧑 מקסימום תפוסה:</b> {listing.capacity}
          </Text>
          <Text>
            <b>🚨 מרחב מוגן:</b> {protectedSpaceTypeToHebrewString(listing.protectedSpace)}
          </Text>
          <Text>
            <b>♿️ נגישות לנכים: </b> {nullableBooleanToHebrewString(listing.disabledAccessibility)}
          </Text>
          <Text>
            <b>🐶 האם ניתן להביא בע״ח:</b> {nullableBooleanToHebrewString(listing.petsFriendly)}
          </Text>
          <Text>
            <b>🐶 האם יש בע״ח בבית:</b> {nullableBooleanToHebrewString(listing.petsExisting)}
          </Text>
          <Text>
            <b>🍽️ כשר: </b> {nullableBooleanToHebrewString(listing.kosher)}
          </Text>
          {listing.description !== "" && (
            <Text mb={1}>
              <b>ℹ️ מידע נוסף:</b> {listing.description || "אין תיאור"}
            </Text>
          )}
          <Flex align="center">
            <Icon as={PhoneIcon} boxSize={5} marginLeft={2} paddingLeft={1} />
            <Link href={`tel:${listing.phone}`} ml={2}>
              {listing.phone}
            </Link>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
