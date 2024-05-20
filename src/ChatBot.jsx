import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa";
import { CgNotes } from "react-icons/cg";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import ChatButton from "./ChatButton";
import ChatDialog from "./ChatDialog";
import useGoogleGenerativeAI from "./useGoogleGenerativeAI";

const ChatBot = () => {
  const [history, setHistory] = useState([]); // Now stores user interactions
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const { genAI, model } = useGoogleGenerativeAI();

  const hardcodedHistory = [
    {
      role: "user",
      parts:
        "You are in voice assistant you every answer after this under three line & in pure text",
    },
    {
      role: "model",
      parts:
        "Okay, I will give every answer under 3 lines from now & in pure text",
    },
  ];

  useEffect(() => {
    if (!genAI || !model) return;

    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    const handleResult = async (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      console.log("Recognized speech:", transcript);

      setHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", parts: transcript },
      ]);
      setIsProcessing(true);

      try {
        const chat = await model.startChat({
          history: [...hardcodedHistory, ...history],
        });

        const result = await chat.sendMessageStream(transcript);
        const response = await result.response;
        const text = await response.text();

        setHistory((prevHistory) => [
          ...prevHistory,
          { role: "model", parts: text },
        ]);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2;
        utterance.pitch = 1.2;
        utterance.voiceURI = "Google UK English Female";
        utterance.onend = () => setIsProcessing(false);

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
      } catch (error) {
        console.error("Error processing response:", error);
        setIsProcessing(false);
      }
    };

    const handleError = (event) => {
      setSpeechError(event.error);
      setIsProcessing(false);
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = () => setIsProcessing(false);

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [genAI, model]);

  const toggleSpeechRecognition = () => {
    if (isProcessing) {
      recognitionRef.current.stop();
      if (utteranceRef.current) {
        synthRef.current.cancel();
      }
      setIsProcessing(false);
    } else {
      recognitionRef.current.start();
      setIsProcessing(true);
    }
  };

  const toggleChatVisibility = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-center w-full">
        <button
          onClick={toggleSpeechRecognition}
          className="flex items-center px-4 py-2 bg-blue-600 shadow-lg text-white rounded-full hover:bg-blue-700 transition mb-4"
        >
          {isProcessing ? (
            <FaMicrophoneAltSlash className="text-3xl m-2" />
          ) : (
            <FaMicrophone className="text-3xl m-2" />
          )}
        </button>
      </div>
      <div className="w-full bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-2">Transcriptions:</h2>
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            <strong>{entry.role}:</strong> {entry.parts}
          </div>
        ))}
      </div>
      <ChatButton toggleChatVisibility={toggleChatVisibility} />
      <Transition appear show={showChat} as={Fragment}>
        <ChatDialog
          history={history}
          isProcessing={isProcessing}
          speechError={speechError}
          toggleChatVisibility={toggleChatVisibility}
        />
      </Transition>
    </div>
  );
};

export default ChatBot;
