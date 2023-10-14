"use client";

import React, { useState } from "react";
import { Box, Text, Icon, Flex, Link, Button } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

import { Listing } from "@/src/common/models/listing";
import { protectedSpaceTypeToHebrewString } from "@/src/common/models/protected_space";
import { nullableBooleanToHebrewString } from "@/src/common/utils";

import type ReCAPTCHA from "react-google-recaptcha";
import type { RefObject } from "react";

type ListingCardProps = {
  listing: Listing;
  backgroungColor?: string;
  recaptchaRef: RefObject<ReCAPTCHA | undefined>;
  recaptchaSolved: boolean;
};

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  backgroungColor,
  recaptchaRef,
  recaptchaSolved,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPhone, setShowPhone] = useState<boolean>(false);

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
          {listing.protectedSpace && (
            <Text>
              <b>🚨 מרחב מוגן:</b>{" "}
              {protectedSpaceTypeToHebrewString(listing.protectedSpace)}
            </Text>
          )}
          {listing.disabledAccessibility && (
            <Text>
              <b>♿️ נגישות לנכים: </b>{" "}
              {nullableBooleanToHebrewString(listing.disabledAccessibility)}
            </Text>
          )}
          {listing.petsFriendly && (
            <Text>
              <b>🐶 האם ניתן להביא בע״ח:</b>{" "}
              {nullableBooleanToHebrewString(listing.petsFriendly)}
            </Text>
          )}
          {listing.petsExisting && (
            <Text>
              <b>🐶 האם יש בע״ח בבית:</b>{" "}
              {nullableBooleanToHebrewString(listing.petsExisting)}
            </Text>
          )}
          {listing.kosher && (
            <Text>
              <b>🍽️ כשר: </b> {nullableBooleanToHebrewString(listing.kosher)}
            </Text>
          )}
          {listing.description !== "" && (
            <Text mb={1}>
              <b>ℹ️ מידע נוסף:</b> {listing.description || "אין תיאור"}
            </Text>
          )}

          {showPhone ? (
            <Flex align="center">
              <Icon as={PhoneIcon} boxSize={5} marginLeft={2} paddingLeft={1} />
              <Link href={`tel:${listing.phone}`} ml={2}>
                {listing.phone}
              </Link>
            </Flex>
          ) : (
            <Button
              size="sm"
              colorScheme="gray"
              isLoading={isLoading}
              onClick={() => {
                if (recaptchaSolved) {
                  setShowPhone(true);
                } else {
                  recaptchaRef?.current?.execute();
                }
              }}
            >
              הצג מספר
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
