"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic as MicIcon } from "lucide-react";

interface SpeechToTextProps {
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

const SpeechToText = ({ setInputValue }: SpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  // @ts-ignore
  const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  const startListening = () => {
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setInputValue((prev) => prev + transcript + " ");
    };
  };

  const stopListening = () => {
    recognition.continuous = false;
    recognition.stop();
    recognition.onresult = null;
    setIsListening(false);
  };

  recognition.onspeechend = () => {
    recognition.stop();
  };

  return (
    <Button
      size="icon"
      variant={isListening ? "destructive" : "outline"}
      className={`w-full px-6 rounded-md`}
      onClick={isListening ? stopListening : startListening}
    >
      <MicIcon className="h-4 w-4" />
      {isListening ? (
        <div className="flex items-center">Stop Listening</div>
      ) : (
        <span>Start Listening</span>
      )}
    </Button>
  );
};

export default SpeechToText;