"use client";

import { Box, Heading, Text, Icon, Flex, Link, Spacer } from '@chakra-ui/react';
import { PhoneIcon, AtSignIcon, TimeIcon } from '@chakra-ui/icons';
import { Listing } from './listing';

type ListingCardProps = {
    listing: Listing;
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    return (
        <Box w={"100%"} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mb={4} h="150px">
            <Flex direction="row">
                <Box flex="2" pb="4">
                    <Text fontWeight="semibold" mb={2}>
                        מארח: {listing.name}
                    </Text>
                    <Text fontWeight="semibold">{listing.city}</Text>
                    <Text>כתובת: {listing.address}</Text>
                    <Text mb={1}>כיבולת: {listing.capacity}</Text>
                    <Text mb={1}>תיאור: {listing.description || 'אין תיאור'}</Text>
                </Box>
                <Spacer />
                <Box flex="1" pl={5}>
                    <Flex align="center" mb={2}>
                        <Icon as={PhoneIcon} boxSize={5} />
                        <Link href={`tel:${listing.phone}`} ml={2}>{listing.phone}</Link>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};
