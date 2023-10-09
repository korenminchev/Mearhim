import { useState } from 'react';
import { Box, Button, Text, HStack, Center } from '@chakra-ui/react';

interface CapacityFilterProps {
    capacity: number;
    onFilterChange: (capacity: number) => void;
}

const CapacityFilter: React.FC<CapacityFilterProps> = ({ capacity, onFilterChange }) => {


  const increaseCapacity = (prev: number) => {
    if (prev >= 10) return;
    const newCapacity = prev + 1;
    onFilterChange(newCapacity);
  }

  const decreaseCapacity = (prev: number) => {
    if (prev <= 1) return; 
    const newCapacity = prev - 1;
    onFilterChange(newCapacity);
    
  }

    return (
      <Box>
        <Text mb={2} textAlign={'center'}> מס׳ מתארחים מינימלי:</Text>
        <Center>
          <HStack>
            <Button onClick={(e) => decreaseCapacity(capacity)} size="sm" isDisabled={capacity === 1}>
                -
            </Button>
            <Text>{capacity >= 10 ? "10+" : capacity}</Text>
            <Button onClick={(e) => increaseCapacity(capacity)} size="sm" isDisabled={capacity >= 10}>
                +
            </Button>
          </HStack>
        </Center>
      </Box>
    );
};

export default CapacityFilter;
