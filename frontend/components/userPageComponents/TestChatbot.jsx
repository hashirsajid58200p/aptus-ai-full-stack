"use client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const TestChatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "Bot", message: "Hello! How can I assist you with your business queries today?" },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const hasLiveTranscribedRef = useRef(false);

  // Terminate all microphone recording & hardware streams immediately
  const stopAllAudio = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) {}
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopAllAudio();
    } else {
      hasLiveTranscribedRef.current = false;

      // 1. Live real-time speech recognition
      const SpeechRec =
        typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

      if (SpeechRec) {
        try {
          const recognition = new SpeechRec();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang =
            typeof navigator !== "undefined" && navigator.languages && navigator.languages.length > 0
              ? navigator.languages[0]
              : "en-US";

          const initialText = messageInput.trim();

          recognition.onresult = (event) => {
            let liveTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
              liveTranscript += event.results[i][0].transcript;
            }
            if (liveTranscript.trim()) {
              hasLiveTranscribedRef.current = true;
              setMessageInput(initialText ? `${initialText} ${liveTranscript.trim()}` : liveTranscript.trim());
            }
          };

          recognition.onerror = (e) => {
            console.warn("Speech recognition notice:", e?.error);
          };

          recognition.onend = () => {
            recognitionRef.current = null;
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (recErr) {
          console.warn("Real-time speech recognition could not start:", recErr);
        }
      }

      // 2. Concurrently record for high-accuracy Whisper multilingual fallback
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        mediaStreamRef.current = stream;

        let mimeType = "audio/webm";
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 128000 });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          if (mediaStreamRef.current) {
            try {
              mediaStreamRef.current.getTracks().forEach((track) => {
                track.stop();
                track.enabled = false;
              });
            } catch (e) {}
            mediaStreamRef.current = null;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          if (audioBlob.size < 600) {
            setIsRecording(false);
            setIsTranscribing(false);
            return;
          }

          setIsTranscribing(true);
          try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              try {
                const base64Audio = reader.result;
                const res = await fetch(`${baseurl}/chatbot/transcribe`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    audio: base64Audio,
                    mimeType,
                    token: user?.chatbot_token,
                    prompt: "A natural conversation with a customer service assistant in English, Urdu (اردو), or Roman Urdu.",
                  }),
                });

                const data = await res.json();
                if (data.success && data.text) {
                  const text = data.text.trim();
                  if (text) {
                    setMessageInput((prev) => (prev && hasLiveTranscribedRef.current ? text : prev ? `${prev} ${text}` : text));
                    toast.success("Voice transcribed accurately!");
                  }
                }
              } catch (err) {
                console.error("Transcription fetch error:", err);
              } finally {
                setIsTranscribing(false);
                setIsRecording(false);
              }
            };
          } catch (err) {
            console.error("Transcription error:", err);
            setIsTranscribing(false);
            setIsRecording(false);
          }
        };

        mediaRecorder.start(250);
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access error:", err);
        if (recognitionRef.current) {
          setIsRecording(true);
        } else {
          toast.error("Microphone permission denied");
        }
      }
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      const newMessages = [...messages, { sender: "You", message: messageInput }];
      setMessages(newMessages);
      setMessageInput("");
      setLoading(true);

      // Pair user questions with bot answers cleanly, skipping initial welcome greeting offset
      const conversationHistory = messages.filter((msg, idx) => !(idx === 0 && msg.sender === "Bot"));
      const formattedMessages = [];
      for (let i = 0; i < conversationHistory.length - 1; i += 2) {
        const userMsg = conversationHistory[i];
        const botMsg = conversationHistory[i + 1];
        if (userMsg && userMsg.sender === "You" && botMsg && botMsg.sender === "Bot") {
          formattedMessages.push({
            question: userMsg.message,
            answer: botMsg.message,
          });
        }
      }

      try {
        setMessages(prev => [...prev, { sender: "Bot", message: "Typing..." }]);

        const response = await fetch(`${baseurl}/chatbot/test/owner`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            message: messageInput,
            messages: formattedMessages,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Request failed");
        }

        setMessages(prev =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { sender: "Bot", message: data.data }
              : msg
          )
        );
      } catch (error) {
        console.error("Error:", error);
        setMessages(prev => [...prev, { sender: "Bot", message: "Sorry, something went wrong." }]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-[#1a1a1a] pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] px-2.5 sm:px-3 py-0.5 sm:py-1 font-extrabold text-[10px] sm:text-xs uppercase inline-block">
            Live Sandbox
          </span>
          <h3 className="font-syne text-base sm:text-2xl font-extrabold text-[#1a1a1a] uppercase leading-tight">
            Test Aptus AI Chatbot
          </h3>
        </div>
        <span className="text-[11px] font-bold text-gray-500 uppercase">
          Groq Whisper Voice Enabled
        </span>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto mb-4 p-3 sm:p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] min-h-[55vh] max-h-[60vh]">
        {messages.map((chat, index) => (
          <div
            key={index}
            className={`mb-4 max-w-[85%] ${
              chat.sender === "You" ? "ml-auto text-right" : "mr-auto text-left"
            }`}
          >
            <span
              className={`inline-block p-2.5 sm:p-3 font-semibold text-xs sm:text-sm border-2 border-[#1a1a1a] shadow-neo-sm ${
                chat.sender !== "You"
                  ? "bg-white text-[#1a1a1a]"
                  : "bg-[#2D31FA] text-white"
              }`}
            >
              {chat.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={isRecording ? "Listening to your voice..." : "Ask your trained Aptus AI assistant or use microphone..."}
          className="flex-1 p-2.5 sm:p-3 text-xs sm:text-base bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] font-medium placeholder-gray-500 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
          disabled={loading || isTranscribing}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        {/* Microphone Button (Whisper STT) */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={loading || isTranscribing}
          className={`p-2.5 sm:p-3 border-2 border-[#1a1a1a] shadow-neo-sm transition-all ${
            isRecording
              ? "bg-[#EF4444] text-white animate-pulse"
              : isTranscribing
              ? "bg-amber-400 text-black"
              : "bg-white hover:bg-gray-100 text-[#1a1a1a]"
          }`}
          title={isRecording ? "Click to stop and transcribe" : "Click to speak"}
        >
          {isTranscribing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="p-2.5 sm:p-3 bg-[#BFF000] border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] text-[#1a1a1a] font-bold disabled:opacity-50 transition-all"
          disabled={loading || isRecording || isTranscribing}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TestChatbot;
