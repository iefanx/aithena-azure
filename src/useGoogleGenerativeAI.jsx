import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const useGoogleGenerativeAI = () => {
  const [genAI, setGenAI] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const genAIInstance = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const modelInstance = genAIInstance.getGenerativeModel({
      model: "gemini-pro",
    });
    setGenAI(genAIInstance);
    setModel(modelInstance);
  }, []);

  return { genAI, model };
};

export default useGoogleGenerativeAI;
