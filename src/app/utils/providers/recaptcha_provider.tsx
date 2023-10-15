import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { isProduction } from "@/src/common/utils";

interface ReCaptchaContextProps {
  activeListingId: number | null;
  setActiveListingId: React.Dispatch<React.SetStateAction<number | null>>;
  recaptchaSolved: boolean;
  setRecaptchaSolved: React.Dispatch<React.SetStateAction<boolean>>;
  recaptchaExited: boolean;
  setRecaptchaExited: React.Dispatch<React.SetStateAction<boolean>>;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
}

export const ReCaptchaContext = createContext<ReCaptchaContextProps | undefined>(undefined);

interface ReCaptchaProviderProps {
  children: ReactNode;
}

export const ReCaptchaProvider: React.FC<ReCaptchaProviderProps> = ({ children }) => {
  const [activeListingId, setActiveListingId] = useState<number | null>(null);
  const [recaptchaSolved, setRecaptchaSolved] = useState<boolean>(false);
  const [recaptchaExited, setRecaptchaExited] = useState<boolean>(false);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  const onRecaptchaSuccess = async (value: string | null) => {
    if (!value) {
      setRecaptchaExited(true);
      return;
    }

    const response = await fetch("/api/verifyRecaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recaptchaValue: value,
        recaptchaType: "showPhone",
      }),
    });

    const recaptchaData = await response.json();
    if (!recaptchaData.success) {
      return;
    }

    setRecaptchaExited(false);
    setRecaptchaSolved(true);
    recaptchaRef.current?.reset();
  };

  const onRecaptchaAbort = () => {
    setRecaptchaExited(true);
  };

  return (
    <ReCaptchaContext.Provider
      value={{
        activeListingId,
        setActiveListingId,
        recaptchaSolved,
        setRecaptchaSolved,
        recaptchaExited,
        setRecaptchaExited,
        recaptchaRef,
      }}
    >
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        onChange={onRecaptchaSuccess}
        onErrored={onRecaptchaAbort}
        sitekey={
          isProduction()
            ? "6LdhAZgoAAAAANy_4Vh8NLfDHy8VLJFcMXBeyDIi"
            : "6LeRAJgoAAAAAOB5NmcfgPBrZ3hH6cyuDA78q3v6"
        }
      />

      {children}
    </ReCaptchaContext.Provider>
  );
};

export const useReCaptcha = () => {
  const context = useContext(ReCaptchaContext);
  if (!context) {
    throw new Error("useReCaptcha must be used within a ReCaptchaProvider");
  }
  return context;
};
