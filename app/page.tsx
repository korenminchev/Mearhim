"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  VStack,
  list,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import supabase from "./utils/supabaseClient";
import { Listing } from "./listings/listing";
import { ListingCard } from "./listings/listingCard";
import Link from "next/link";
import ReadMoreComponent from "@/components/read_more_component";

const Listings = () => {
  const [listings, setListings] = useState<Array<Listing>>([]);
  const [filteredListings, setFilteredListings] = useState<Array<Listing>>([]);
  const [pinnedListings, setPinnedListings] = useState<Array<Listing>>([]);
  const [search, setSearch] = useState<string>("");
  const [postsLimit, setPostsLimit] = useState<number>(100);

  function filterListings(listings: Array<Listing>, search: string) {
    // Sort descending by id
    listings.sort((a, b) => b.id - a.id);

    // Set pinned listings
    setPinnedListings(listings.filter((listing) => listing.pinned));
    listings = listings.filter((listing) => !listing.pinned);

    if (!search || search.length == 0) return listings;
    return listings.filter((listing) =>
      listing.city.toLowerCase().startsWith(search.toLowerCase())
    );
  }

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    const filteredListings = filterListings(listings, search);
    setFilteredListings(filteredListings);
  }, [search]);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("active", true);
    if (data) {
      setListings(data);
      setFilteredListings(filterListings(data, search));
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </VStack>
      </Box>
      <Grid templateColumns="repeat(1, 1fr)" gap={4}>
        {pinnedListings.map((listing) => (
          <GridItem key={listing.id}>
            <ListingCard listing={listing} backgroungColor={"green.100"} />
          </GridItem>
        ))}
        {filteredListings.map((listing, index) => {
          if (index >= postsLimit) return;

          return (
            <GridItem key={listing.id}>
              <ListingCard listing={listing} />
            </GridItem>
          );
        })}
      </Grid>
      {listings?.length > 0 ? (
        <Button m={4} onClick={(e) => setPostsLimit(postsLimit + 50)}>
          הצג עוד
        </Button>
      ) : null}
    </Container>
  );
};

export default Listings;
