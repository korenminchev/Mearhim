"use client";

import { Box, Heading, Text, Icon, Flex, Link, Spacer } from '@chakra-ui/react';
import { PhoneIcon, AtSignIcon, TimeIcon } from '@chakra-ui/icons';
import { Listing } from './listing';

type ListingCardProps = {
    listing: Listing;
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    return (
        <Box w={"100%"} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Flex direction="row">
                <Box flex="2">
                    <Text fontWeight="semibold">
                        מארח: {listing.name}
                    </Text>
                    <Text fontWeight="semibold">{listing.city}</Text>
                    <Text mb={1}>מס׳ אנשים: {listing.capacity}</Text>
                    <Text mb={1}>תיאור: {listing.description || 'אין תיאור'}</Text>
                    <Flex align="center">
                        <Icon as={PhoneIcon} boxSize={5} />
                        <Link href={`tel:${listing.phone}`} ml={2}>{listing.phone}</Link>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};
