"use client";

import { useState } from 'react';
import { Box, Button, Center, FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import supabase from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';

const CreateListing = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        const { data, error } = await supabase
            .from('listings')
            .insert([
                {
                    name,
                    address,
                    phone,
                    city,
                    capacity,
                    description
                }
            ]);

        if (!error) {
            alert('המודעה נוצרה בהצלחה');
            router.push('/');
            // Reset form or redirect as needed
        } else {
            alert(`Error: ${error?.message || 'Unknown error'}`);
        }
    };

    return (
        <Center>
        <VStack w={"80%"} spacing={4} align="center" mt={10}>
            <FormControl>
                <FormLabel>שם המארח</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>עיר</FormLabel>
                <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>מספר טלפון</FormLabel>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>כמות אנשים אפשרית לאירוח</FormLabel>
                <Input type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} />
            </FormControl>
            <FormControl>
                <FormLabel>תיאור (לא חובה)</FormLabel>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <Button mt={4} onClick={handleSubmit}>
                Create Listing
            </Button>
        </VStack>
        </Center>
    );
};

export default CreateListing;
