import { useState, useEffect, useRef } from "react";

const useSpeechRecognition = (handleResult, handleError) => {
  const recognitionRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      handleError({ error: "Speech recognition not supported" });
      return;
    }

    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = () => setIsProcessing(false);

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [handleResult, handleError]);

  const startRecognition = () => {
    recognitionRef.current?.start();
    setIsProcessing(true);
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
    setIsProcessing(false);
  };

  return {
    isProcessing,
    startRecognition,
    stopRecognition,
  };
};

export default useSpeechRecognition;
