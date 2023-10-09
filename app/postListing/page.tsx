"use client";

import { useState } from 'react';
import { Button, Center, FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import ReCAPTCHA from "react-google-recaptcha";

import supabase from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';

const CreateListing = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [description, setDescription] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

    const isValid = () => !(name == "" || phone == "" || city == "");

    const handleSubmit = async () => {
        // Check that we have
        if (!recaptchaValue) {
            return;
        }

        const response = await fetch('/api/verifyRecaptcha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recaptchaValue })
        });
    
        const recaptchaData = await response.json();
        if (!recaptchaData.success) {
            alert('האימות נכשל, אנא נסה שנית');
            return;
        }

        setName(name.trim());
        setPhone(phone.trim());
        setCity(city.trim());
        setDescription(description.trim());

        if (!isValid()) {
            alert('אנא מלא/י את כל הפרטים');
            return;
        }

        const { data, error } = await supabase
            .from('listings')
            .insert([
                {
                    name,
                    phone,
                    city,
                    capacity,
                    description
                }
            ]);

        if (!error) {
            alert('המודעה נוצרה בהצלחה, אנו מודים לך על העזרה 🙏❤️');
            router.push('/');
            // Reset form or redirect as needed
        } else {
            alert(`שגיאה: ${error?.message || 'Unknown error'}`);
        }
    };

    const isProduction = () => process.env.NODE_ENV == 'production';

    return (
        <Center>
        <VStack w={"80%"} spacing={4} align="center" mt={10}>
            <FormControl isRequired={true}>
                <FormLabel>שם המארח</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl isRequired={true}>
                <FormLabel>עיר</FormLabel>
                <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </FormControl>
            <FormControl isRequired={true}>
                <FormLabel>מספר טלפון</FormLabel>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormControl>
            <FormControl isRequired={true}>
                <FormLabel>כמות אנשים מקסימלית לאירוח</FormLabel>
                <Input type="number" value={capacity == 0 ? "" : capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} />
            </FormControl>
            <FormControl>
                <FormLabel>תיאור (לא חובה)</FormLabel>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl>
                <ReCAPTCHA
                    sitekey={
                        isProduction()
                            ? "6LfiMogoAAAAAFGBG41bantHXAyd1na7djaCKOq3"
                            : "6LdKMYgoAAAAAH6HODGNisHXCycU2fMcagTJq_cp"
                    }
                    onChange={value => setRecaptchaValue(value)}
                />
            </FormControl>
            <Button mt={4} onClick={handleSubmit} isDisabled={!isValid()}>
                פרסם מודעה
            </Button>
        </VStack>
        </Center>
    );
};

export default CreateListing;
