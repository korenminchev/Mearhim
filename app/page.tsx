"use client";

import { Box, Button, Center, Flex, Grid, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { use, useEffect, useState } from 'react';
import supabase from './utils/supabaseClient';
import { Listing } from './listings/listing';
import { ListingCard } from './listings/listingCard';
import Link from 'next/link';

const Listings = () => {
    const [listings, setListings] = useState<Array<Listing>>([]);
    const [filteredListings, setFilteredListings] = useState<Array<Listing>>([]);
    const [search, setSearch] = useState<string>('');

    function filterListings(listings: Array<Listing>, search: string) {
        console.log(search);
        console.log(listings, filteredListings);
        if (!search || search.length == 0) return listings;
        return listings.filter((listing) => listing.city.toLowerCase().startsWith(search.toLowerCase()));
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
            .from('listings')
            .select('*');
        if (data) {
          setListings(data);
          setFilteredListings(data);
        }
    };


    return (
      <Flex direction="column" alignItems="center" mt={10}>
          <Link href="/postListing" passHref>
            <Button as="a" colorScheme="blue">
              יצירת מודעה חדשה
            </Button>
          </Link>
            <Box width="80%" mb={5}>
                <Center>
                  <Heading mb={4}>מודעות</Heading>
                </Center>
                <VStack spacing={4}>
                    <Input placeholder="חיפוש לפי עיר" value={search} onChange={(e) => setSearch(e.target.value)} />
                </VStack>
            </Box>

            <Grid w={'75%'} templateColumns="repeat(2, 1fr)" gap={4}>
            {filteredListings.map((listing) => (
                <Box key={listing.id}>
                    <ListingCard listing={listing} />
                </Box>
            ))}
        </Grid>
        </Flex>
    );
};

export default Listings;