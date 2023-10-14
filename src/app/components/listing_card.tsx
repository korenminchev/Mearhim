"use client";

import React, { useEffect, useState } from "react";
import { Box, Text, Icon, Flex, Link, Button } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

import { Listing } from "@/src/common/models/listing";
import { protectedSpaceTypeToHebrewString } from "@/src/common/models/protected_space";
import { nullableBooleanToHebrewString } from "@/src/common/utils";
import { useReCaptcha } from "@/src/app/utils/providers/recaptcha_provider";

type ListingCardProps = {
  listing: Listing;
  backgroundColor?: string;
  incrementCounter?: (listingId: number) => Promise<void>;
};

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  backgroundColor,
  incrementCounter,
}) => {
  const {
    activeListingId,
    setActiveListingId,
    recaptchaSolved,
    setRecaptchaSolved,
    recaptchaExited,
    setRecaptchaExited,
    recaptchaRef,
  } = useReCaptcha();

  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (activeListingId === listing.id && recaptchaSolved) {
      setShowPhone(true);
      setIsLoading(false);
      setActiveListingId(null);
      setRecaptchaSolved(false);
      incrementCounter?.(listing.id);
    }

    if (recaptchaExited) {
      setIsLoading(false);
      setActiveListingId(null);
      setRecaptchaExited(false);
    }
  }, [
    activeListingId,
    setActiveListingId,
    recaptchaSolved,
    setRecaptchaSolved,
    recaptchaExited,
    setRecaptchaExited,
    listing.id,
  ]);

  return (
    <Box
      w={"100%"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      background={backgroundColor}
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
              <b>🚨 מרחב מוגן:</b> {protectedSpaceTypeToHebrewString(listing.protectedSpace)}
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
              <b>🐶 האם ניתן להביא בע״ח:</b> {nullableBooleanToHebrewString(listing.petsFriendly)}
            </Text>
          )}
          {listing.petsExisting && (
            <Text>
              <b>🐶 האם יש בע״ח בבית:</b> {nullableBooleanToHebrewString(listing.petsExisting)}
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
                setIsLoading(true);
                setActiveListingId(listing.id);
                recaptchaRef.current?.execute();
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
