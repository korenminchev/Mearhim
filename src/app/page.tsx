"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import ReadMoreComponent from "@/src/app/components/read_more_component";
import CapacityFilter from "@/src/app/components/capacity_filter";
import { ListingCard } from "@/src/app/components/listing_card";
import { fetchListings } from "@/src/app/utils/api";
import { Listing } from "@/src/common/models/listing";
import _, { random } from "lodash";
import { listingPageSize } from "@/src/common/constants";

const Listings = () => {
  const [realTimeCitySearch, setRealTimeCitySearch] = useState<string>(""); // <-- New state for immediate feedback
  const [citySearch, setCitySearch] = useState<string>("");
  const debouncedCitySearch = useCallback(
    _.debounce((value: string) => setCitySearch(value), 300),
    []
  );

  const [realTimeCapacityFilter, setRealTimeCapacityFilter] =
    useState<number>(2); // <-- New state for immediate feedback
  const [capacityFilter, setCapacityFilter] = useState<number>(2);
  const debouncedCapacityFilter = useCallback(
    _.debounce((value: number) => setCapacityFilter(value), 300),
    []
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
      getListings(0, capacityFilter, citySearch);
    }
  }, [citySearch, capacityFilter]);

  useEffect(() => {
    if (isFetching) return;

    getListings(page, capacityFilter, citySearch);
  }, [page]);

  const getListings = async (pg: number, capacity: number, city: string) => {
    if (fetching.current) return;
    fetching.current = true;
    setIsFetching(true);
    try {
      if (pg === 0) {
        setListings([]);
      }

      const response = await fetchListings(pg, capacity, city);
      if (response) {
        setListings((prevListings) => prevListings.concat(response));
      }

      if (response.length < listingPageSize) {
        console.log(response);
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
    <Container
      py="40px"
      maxW={"container.xl"}
      centerContent
      as="main"
      maxH="100vh"
    >
      <Box pb={5}>
        <Center>
          <Heading mb={4}>אתר &quot;מארחים&quot;</Heading>
        </Center>
        <Center>
          <ReadMoreComponent
            content={`
במטרה להקל על התושבים ולהעניק להם קצת שקט, החלטנו להקים אתר בו תוכלו למצוא מידע על משפחות מארחות שמוכנות לפתוח את דלתות בתיהם בלב רחב. זאת על מנת לאפשר למי שמעוניין להתארח או לברוח מהבלאגן באופן זמני.
בהתאם להתפשטות המצב הביטחוני והרקטות המתמשכות בדרום הארץ, אנו פונים אל הקהל הרחב לתמיכה וסיוע לתושבי הדרום בימים הקשים אלה.
אנו ממליצים ומבקשים מכלל הציבור לשתף את ההודעה ולהעבירה הלאה כמה שיותר, כדי להפיק מקסימום תועלת מהאתר ומהמיזם, ובכך לאפשר למספר הגדול ביותר של משפחות למצוא מקום מוגן וחם בו יוכלו להתארח.
                        `}
            limit={150}
          ></ReadMoreComponent>
        </Center>
        <VStack spacing={4}>
          <Link href="/postListing" passHref>
            <Button variant={"solid"} colorScheme="green">
              לפרסום מודעה חדשה
            </Button>
          </Link>
          <Link
            href="https://wa.me/+972548816044?text=היי%20אני%20רוצה..."
            target="_blank"
            passHref
          >
            <Button variant={"link"} colorScheme="red">
              לעריכת/הסרת מודעה קיימת
            </Button>
          </Link>
          <Link href="https://wa.me/+972548816044" target="_blank" passHref>
            <Button variant={"link"} colorScheme="teal">
              למידע נוסף ושאלות
            </Button>
          </Link>
          <Input
            placeholder="חיפוש לפי עיר"
            value={realTimeCitySearch}
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
          <Divider />
        </VStack>
      </Box>
      <VStack spacing={2} w={"95%"}>
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
              backgroungColor={listing.pinned ? "green.100" : undefined}
            />
          );
        })}

        {showMoreButton ? (
          <Button m={4} onClick={(e) => setPage(page + 1)} isLoading={isFetching}>
            הצג עוד
          </Button>
        ) : null}
      </VStack>
    </Container>
  );
};

export default Listings;
