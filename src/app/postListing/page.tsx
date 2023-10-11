"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  Text,
  Link,
} from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";

import { useRouter } from "next/navigation";

import { createListing } from "@/src/app/utils/api";
import { Listing } from "@/src/common/models/listing";
import { protectedSpaceTypeToHebrew } from "@/src/common/models/protected_space";

const CreateListing = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [description, setDescription] = useState("");
  const [protectedSpaceType, setProtectedSpaceType] = useState<string>("NONE");
  const [disabledAccessibility, setDisabledAccessibility] = useState<boolean>(false);
  const [petsFriendly, setPetsFriendly] = useState<boolean>(false);
  const [petsExisting, setPetsExisting] = useState<boolean>(false);
  const [kosher, setKosher] = useState<boolean>(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const isValid = () => !(name == "" || phone == "" || city == "");

  const handleSubmit = async () => {
    // Check that we have
    if (!recaptchaValue) {
      return;
    }

    const response = await fetch("/api/verifyRecaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recaptchaValue }),
    });

    const recaptchaData = await response.json();
    if (!recaptchaData.success) {
      alert("האימות נכשל, אנא נסה שנית");
      return;
    }

    setName(name.trim());
    setPhone(phone.trim());
    setCity(city.trim());
    setDescription(description.trim());

    if (!isValid()) {
      alert("אנא מלא/י את כל הפרטים");
      return;
    }

    const listing = {
      name: name,
      phone: phone,
      city: city,
      capacity: capacity,
      description: description,
      protectedSpace: protectedSpaceType,
      disabledAccessibility: disabledAccessibility,
      petsFriendly: petsFriendly,
      petsExisting: petsExisting,
      kosher: kosher,
    } as Listing;

    createListing(listing)
      .catch((error) => {
        alert(`שגיאה: ${error?.message || "Unknown error"}`);
      })
      .then((response) => {
        if (!response) return;
        alert("המודעה נוצרה בהצלחה, אנו מודים לך על העזרה 🙏❤️");
        router.push("/");
      });
  };

  const isProduction = () => process.env.NODE_ENV == "production";

  return (
    <Container py="40px" maxW={"container.xl"} centerContent as="main" maxH="100vh">
      <Center>
        <VStack>
          <Link href="javascript:history.back()">
            <Button variant={"link"}>חזרה</Button>
          </Link>
          <Heading mb={4}>➕יצירת מודעה חדשה</Heading>
        </VStack>
      </Center>

      <VStack w={"80%"} spacing={4} align="center" mt={10}>
        <FormControl id="hosterName" isRequired={true}>
          <FormLabel>🏠 שם המארח</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>

        <FormControl id="city" isRequired={true}>
          <FormLabel>🏙️ ישוב</FormLabel>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </FormControl>

        <FormControl id="phone" isRequired={true}>
          <FormLabel>📞 מספר טלפון</FormLabel>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormControl>

        <FormControl id="maximumCapacity" isRequired={true}>
          <FormLabel>🧑‍🤝‍🧑 כמות אנשים מקסימלית לאירוח</FormLabel>
          <Input
            type="number"
            value={capacity == 0 ? "" : capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
          />
        </FormControl>

        <FormControl id="protectedSpaceType" isRequired={true}>
          <FormLabel>🚨 מרחב מוגן</FormLabel>
          <Select
            defaultValue={protectedSpaceType}
            onChange={(e) => setProtectedSpaceType(e.target.value)}
          >
            {Object.entries(protectedSpaceTypeToHebrew).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="disabledAccessibility">
          <HStack>
            <Text>♿️</Text>
            <Checkbox onChange={(e) => setDisabledAccessibility(e.target.checked)}></Checkbox>
            <FormLabel>נגישות לנכים</FormLabel>
          </HStack>
        </FormControl>

        <FormControl id="petsFriendly">
          <HStack>
            <Text>🐶</Text>
            <Checkbox onChange={(e) => setPetsFriendly(e.target.checked)}></Checkbox>
            <FormLabel>האם אפשר להביא בע״ח</FormLabel>
          </HStack>
        </FormControl>

        <FormControl id="petsExisting">
          <HStack>
            <Text>🐶</Text>
            <Checkbox onChange={(e) => setPetsExisting(e.target.checked)}></Checkbox>
            <FormLabel>האם יש בדירה בע״ח</FormLabel>
          </HStack>
        </FormControl>

        <FormControl id="kosher">
          <HStack>
            <Text>🍴</Text>
            <Checkbox onChange={(e) => setKosher(e.target.checked)}></Checkbox>
            <FormLabel>כשר</FormLabel>
          </HStack>
        </FormControl>

        <FormControl id="description">
          <FormLabel>ℹ️ מידע נוסף (לא חובה)</FormLabel>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>

        <FormControl>
          <ReCAPTCHA
            sitekey={
              isProduction()
                ? "6LfiMogoAAAAAFGBG41bantHXAyd1na7djaCKOq3"
                : "6LdKMYgoAAAAAH6HODGNisHXCycU2fMcagTJq_cp"
            }
            onChange={(value) => setRecaptchaValue(value)}
          />
        </FormControl>
        <Button mt={4} onClick={handleSubmit} isDisabled={!isValid()}>
          פרסם מודעה
        </Button>
      </VStack>
    </Container>
  );
};

export default CreateListing;
