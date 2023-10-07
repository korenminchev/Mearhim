"use client";

import { Box, Heading, Text, Icon, Flex, Link, Spacer } from '@chakra-ui/react';
import { PhoneIcon, AtSignIcon, TimeIcon } from '@chakra-ui/icons';
import { Listing } from './listing';
import ReadMoreComponent from '@/components/read_more_component';

type ListingCardProps = {
    listing: Listing;
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    return (
        <Box w={"100%"} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Flex direction="row">
                <Box flex="2">
                    <Text>
                        <b>מארח:</b> {listing.name}
                    </Text>
                    <Text>
                        <b>עיר:</b> {listing.city}
                    </Text>
                    <Text>
                        <b>מקסימום תפוסה:</b> {listing.capacity}
                    </Text>
                    <Text mb={1}><b>תיאור:</b> {listing.description || 'אין תיאור'}</Text>
                    <Flex align="center">
                        <Icon as={PhoneIcon} boxSize={5} marginLeft={2} paddingLeft={1} />
                        <Link href={`tel:${listing.phone}`} ml={2}>{listing.phone}</Link>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};
