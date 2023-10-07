"use client";

import { useState } from 'react';
import { Box, Button, Text} from '@chakra-ui/react';

interface ReadMoreCompProps {
    content: string, 
    limit: number,
}

function ReadMoreComponent({content, limit = 100}: ReadMoreCompProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (content.length <= limit) {
      return <Text fontSize="xl" mb={4} textAlign={"center"}>{content}</Text>;
    }
  
    return (
      <Box>
        <Text fontSize="sm" mb={4} textAlign={"center"}>
          {isExpanded ? content : `${content.substring(0, limit)}...`}
          {isExpanded && (
            <Button
            size="xs"
            mt={2}
            onClick={() => setIsExpanded(false)}
            variant={"link"}
          >
            קרא/י פחות
          </Button>
        )}
        </Text>
        {!isExpanded && (
          <Button
            size="xs"
            mt={2}
            onClick={() => setIsExpanded(true)}
            variant={"link"}
          >
            קרא/י עוד...
          </Button>
        )}
      </Box>
    );
  }

  export default ReadMoreComponent;