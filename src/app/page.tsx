"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import _ from "lodash";
import ReCAPTCHA from "react-google-recaptcha";

import ReadMoreComponent from "@/src/app/components/read_more_component";
import CapacityFilter from "@/src/app/components/capacity_filter";
import { ListingCard } from "@/src/app/components/listing_card";
import { fetchListings } from "@/src/app/utils/api";
import { Listing } from "@/src/common/models/listing";
import { listingPageSize } from "@/src/common/constants";
import CollapsibleWidget from "@/src/app/components/collapsible_widget";
import ProtectedSpaceFilter, {
  ProtectedSpaceOption,
} from "@/src/app/components/protected_space_filter";
import NullableBooleanFilter from "@/src/app/components/nullable_boolean_filter";
import { ProtectedSpaceType } from "@/src/common/models/protected_space";
import { incrementPhoneClickedCounter } from "@/src/app/utils/api";
import { isProduction } from "../common/utils";

const Listings = () => {
  const recaptchaRef = createRef<ReCAPTCHA>();
  const [recaptchaSolved, setRecaptchaSolved] = useState<boolean>(false);

  const onRecaptchaSuccess = async (value: string | null) => {
    console.log("recaptcha value: ", value);
    if (!value) {
      return;
    }

    const response = await fetch("/api/verifyRecaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recaptchaValue: value,
        recaptchaType: "showPhone",
      }),
    });

    const recaptchaData = await response.json();
    if (!recaptchaData.success) {
      return;
    }
    setRecaptchaSolved(true);

    try {
      incrementPhoneClickedCounter(listing.id);
    } catch {}
    console.log(recaptchaRef.current);
    recaptchaRef.current?.reset();
  };

  const [realTimeCitySearch, setRealTimeCitySearch] = useState<string>("");
  const [citySearch, setCitySearch] = useState<string>("");
  const debouncedCitySearch = useCallback(
    _.debounce((value: string) => setCitySearch(value), 300),
    [],
  );

  const [realTimeCapacityFilter, setRealTimeCapacityFilter] =
    useState<number>(2);
  const [capacityFilter, setCapacityFilter] = useState<number>(2);
  const debouncedCapacityFilter = useCallback(
    _.debounce((value: number) => setCapacityFilter(value), 300),
    [],
  );

  const [realTimeProtectedSpaceFilter, setRealTimeProtectedSpaceFilter] =
    useState<ProtectedSpaceOption[]>([]);
  const [protectedSpaceFilter, setProtectedSpaceFilter] = useState<
    ProtectedSpaceOption[]
  >([]);
  const debouncedProtectedSpaceFilter = useCallback(
    _.debounce(
      (value: ProtectedSpaceOption[]) => setProtectedSpaceFilter(value),
      300,
    ),
    [],
  );

  const [realTimePetsFriendlyFilter, setRealTimePetsFriendlyFilter] = useState<
    boolean | null
  >(null);
  const [petsFriendlyFilter, setPetsFriendlyFilter] = useState<boolean | null>(
    null,
  );
  const debouncedPetsFriendlyFilter = useCallback(
    _.debounce((value: boolean | null) => setPetsFriendlyFilter(value), 300),
    [],
  );

  const [realTimePetsExistingFilter, setRealTimePetsExistingFilter] = useState<
    boolean | null
  >(null);
  const [petsExistingFilter, setPetsExistingFilter] = useState<boolean | null>(
    null,
  );
  const debouncedPetsExistingFilter = useCallback(
    _.debounce((value: boolean | null) => setPetsExistingFilter(value), 300),
    [],
  );

  const [
    realTimeDisabledAccessibilityFilter,
    setRealTimeDisabledAccessibilityFilter,
  ] = useState<boolean | null>(null);
  const [disabledAccessibilityFilter, setDisabledAccessibilityFilter] =
    useState<boolean | null>(null);
  const debouncedDisabledAccessibilityFilter = useCallback(
    _.debounce(
      (value: boolean | null) => setDisabledAccessibilityFilter(value),
      300,
    ),
    [],
  );

  const [realTimeKosherFilter, setRealTimeKosherFilter] = useState<
    boolean | null
  >(null);
  const [kosherFilter, setKosherFilter] = useState<boolean | null>(null);
  const debouncedKosherFilter = useCallback(
    _.debounce((value: boolean | null) => setKosherFilter(value), 300),
    [],
  );

  const [page, setPage] = useState<number>(0);
  const [listings, setListings] = useState<Array<Listing>>([]);
  const [isFetching, setIsFetching] = useState(false);
  const fetching = useRef(false);
  const [showMoreButton, setShowMoreButton] = useState<boolean>(true);

  useEffect(() => {
    if (isFetching) return;

    // Clear the current listings, we are using new filters.
    setShowMoreButton(true);

    // Fetching with page 0 when filters change
    if (page !== 0) {
      setPage(0);
    } else {
      getListings(
        0,
        capacityFilter,
        citySearch,
        protectedSpaceFilter.map((value) => value.value),
        petsFriendlyFilter,
        petsExistingFilter,
        disabledAccessibilityFilter,
        kosherFilter,
      );
    }
  }, [
    citySearch,
    capacityFilter,
    protectedSpaceFilter,
    petsFriendlyFilter,
    petsExistingFilter,
    disabledAccessibilityFilter,
    kosherFilter,
  ]);

  useEffect(() => {
    if (isFetching) return;

    getListings(
      page,
      capacityFilter,
      citySearch,
      protectedSpaceFilter.map((value) => value.value),
      petsFriendlyFilter,
      petsExistingFilter,
      disabledAccessibilityFilter,
      kosherFilter,
    );
  }, [page]);

  const getListings = async (
    pg: number,
    capacity: number,
    city: string,
    protectedSpaces: ProtectedSpaceType[],
    petsFriendly: boolean | null,
    petsExisting: boolean | null,
    disabledAccessibility: boolean | null,
    kosher: boolean | null,
  ) => {
    if (fetching.current) return;
    fetching.current = true;
    setIsFetching(true);
    try {
      if (pg === 0) {
        setListings([]);
      }

      const response = await fetchListings(
        pg,
        capacity,
        city,
        protectedSpaces,
        petsFriendly,
        petsExisting,
        disabledAccessibility,
        kosher,
      );
      if (response) {
        setListings((prevListings) => prevListings.concat(response));
      }

      if (response.length < listingPageSize) {
        setShowMoreButton(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      fetching.current = false;
      setIsFetching(false);
    }
  };

  return (
    <>
      <Container
        py="40px"
        maxW={"fit-content"}
        centerContent
        as="main"
        maxH="100vh"
        w="100%"
      >
        <Box pb={5} maxW={"fit-content"} w="100%">
          <Center>
            <Heading mb={4}>🏠 אתר &quot;מארחים&quot; 🏠</Heading>
          </Center>
          <Center>
            <ReadMoreComponent
              content={`במטרה להקל על התושבים ולהעניק להם קצת שקט, החלטנו להקים אתר בו תוכלו למצוא מידע על משפחות מארחות שמוכנות לפתוח את דלתות בתיהם בלב רחב. זאת על מנת לאפשר למי שמעוניין להתארח או לברוח מהבלאגן באופן זמני.
בהתאם להתפשטות המצב הביטחוני והרקטות המתמשכות בדרום הארץ, אנו פונים אל הקהל הרחב לתמיכה וסיוע לתושבי הדרום בימים הקשים אלה.
אנו ממליצים ומבקשים מכלל הציבור לשתף את ההודעה ולהעבירה הלאה כמה שיותר, כדי להפיק מקסימום תועלת מהאתר ומהמיזם, ובכך לאפשר למספר הגדול ביותר של משפחות למצוא מקום מוגן וחם בו יוכלו להתארח.`}
              limit={150}
            ></ReadMoreComponent>
          </Center>
          <VStack w="100%">
            <Link href="/postListing" passHref>
              <Button variant={"solid"} colorScheme="green" size={"sm"}>
                לפרסום מודעה חדשה
              </Button>
            </Link>
            <Link
              href="https://wa.me/+972548816044?text=היי%20אני%20רוצה..."
              target="_blank"
              passHref
            >
              <Button variant={"solid"} colorScheme="red" size={"sm"}>
                לעריכת/הסרת מודעה קיימת
              </Button>
            </Link>
            <Link href="https://wa.me/+972548816044" target="_blank" passHref>
              <Button variant={"solid"} colorScheme="blue" size={"sm"}>
                למידע נוסף ושאלות
              </Button>
            </Link>
            <Divider margin={4} />
            <Center>
              <Heading size={"md"} mt={1} mb={2}>
                🔍 סינון וחיפוש
              </Heading>
            </Center>
            <Input
              placeholder="חיפוש לפי ישוב"
              value={realTimeCitySearch}
              size={"sm"}
              onChange={(e) => {
                setRealTimeCitySearch(e.target.value); // <-- Immediate feedback
                debouncedCitySearch(e.target.value); // <-- Debounced action
              }}
            />
            <CapacityFilter
              capacity={realTimeCapacityFilter}
              onFilterChange={(value) => {
                setRealTimeCapacityFilter(value); // <-- Immediate feedback
                debouncedCapacityFilter(value); // <-- Debounced action
              }}
            />

            <ProtectedSpaceFilter
              onFilterChange={(values) => {
                const data = values.map((value) => value);
                setRealTimeProtectedSpaceFilter(data);
                debouncedProtectedSpaceFilter(data);
              }}
              props={{
                mt: 4,
                w: "100%",
              }}
              protectedSpaces={protectedSpaceFilter}
            />

            <NullableBooleanFilter
              label="🍴 כשר"
              value={realTimeKosherFilter}
              onFilterChange={(value) => {
                setRealTimeKosherFilter(value);
                debouncedKosherFilter(value);
              }}
              props={{
                mt: 4,
              }}
            />

            {false && (
              <div>
                <NullableBooleanFilter
                  label="♿️ נגישות לנכים"
                  value={realTimeDisabledAccessibilityFilter}
                  onFilterChange={(value) => {
                    setRealTimeDisabledAccessibilityFilter(value);
                    debouncedDisabledAccessibilityFilter(value);
                  }}
                  props={{
                    mt: 4,
                  }}
                />
                <NullableBooleanFilter
                  label="🐶 האם אפשר להביא בע״ח"
                  value={realTimePetsFriendlyFilter}
                  onFilterChange={(value) => {
                    setRealTimePetsFriendlyFilter(value);
                    debouncedPetsFriendlyFilter(value);
                  }}
                  props={{
                    mt: 5,
                  }}
                />
                <NullableBooleanFilter
                  label="🐶 האם יש בע״ח בדירה"
                  value={realTimePetsExistingFilter}
                  onFilterChange={(value) => {
                    setRealTimePetsExistingFilter(value);
                    debouncedPetsExistingFilter(value);
                  }}
                  props={{
                    mt: 5,
                  }}
                />
              </div>
            )}
            <Divider mt={2} />
          </VStack>
        </Box>

        <VStack spacing={2} w={"95%"}>
          <Center>
            <Heading size={"md"} mb={2}>
              📊 תוצאות
            </Heading>
          </Center>

          <Box>
            <Text fontSize="me" mb={4} textAlign={"center"}>
              <b>מספר המודעות המוצגות: {listings.length}</b>
            </Text>
          </Box>

          {listings.map((listing) => {
            return (
              <ListingCard
                key={listing.id}
                listing={listing}
                backgroundColor={listing.pinned ? "green.100" : undefined}
                recaptchaRef={recaptchaRef}
                recaptchaSolved={recaptchaSolved}
              />
            );
          })}

          {showMoreButton ? (
            <Button
              m={4}
              onClick={(e) => setPage(page + 1)}
              isLoading={isFetching}
            >
              הצג עוד
            </Button>
          ) : null}
        </VStack>
      </Container>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        onChange={onRecaptchaSuccess}
        sitekey={
          isProduction()
            ? "6LdhAZgoAAAAANy_4Vh8NLfDHy8VLJFcMXBeyDIi"
            : "6LeRAJgoAAAAAOB5NmcfgPBrZ3hH6cyuDA78q3v6"
        }
      />
    </>
  );
};

export default Listings;
