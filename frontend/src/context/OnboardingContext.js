"use client";
import { createContext, useContext, useEffect, useState } from "react";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem("onboardingComplete") === "true";
    setOnboardingComplete(completed);
    setLoading(false);
  }, []);

  const completeOnboarding = () => {
    setOnboardingComplete(true);
    localStorage.setItem("onboardingComplete", "true");
  };

  return (
    <OnboardingContext.Provider
      value={{ onboardingComplete, completeOnboarding, loading }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
