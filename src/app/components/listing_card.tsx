"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Box, Text, Icon, Flex, Link, Button } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

import { Listing } from "@/src/common/models/listing";
import { protectedSpaceTypeToHebrewString } from "@/src/common/models/protected_space";
import { isProduction, nullableBooleanToHebrewString } from "@/src/common/utils";
import { incrementPhoneClickedCounter } from "../utils/api";

type ListingCardProps = {
  listing: Listing;
  backgroungColor?: string;
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing, backgroungColor }) => {
  const [showPhone, setShowPhone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onRecaptchaChange = async (value: string | null) => {
    console.log("recaptcha value: ", value);
    if (!value) {
      return;
    }

    const response = await fetch("/api/verifyRecaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recaptchaValue: value, recaptchaType: "showPhone" }),
    });

    const recaptchaData = await response.json();
    if (!recaptchaData.success) {
      return;
    }

    setShowPhone(true);
    setIsLoading(false);
    try {
      incrementPhoneClickedCounter(listing.id);
    } catch {}
    recaptchaRef.current?.reset();
  };

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
                recaptchaRef.current?.execute();
              }}
            >
              הצג מספר
            </Button>
          )}

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={
              isProduction()
                ? "6LdhAZgoAAAAANy_4Vh8NLfDHy8VLJFcMXBeyDIi"
                : "6LeRAJgoAAAAAOB5NmcfgPBrZ3hH6cyuDA78q3v6"
            }
            size="invisible"
            onChange={onRecaptchaChange}
          />
        </Box>
      </Flex>
    </Box>
  );
};
