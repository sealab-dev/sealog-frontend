import { useState, useEffect } from "react";

export const useTyping = (messages: string[]) => {
  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    const currentMessage = messages[messageIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentMessage.substring(0, text.length + 1));
        setSpeed(150);
        if (text === currentMessage) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(currentMessage.substring(0, text.length - 1));
        setSpeed(50);
        if (text === "") {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, messageIndex, speed, messages]);

  return text;
};
