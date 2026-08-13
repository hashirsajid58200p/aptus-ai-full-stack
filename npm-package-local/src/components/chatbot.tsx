import React, { useState, useEffect, useRef } from "react";
import generateSession from "../utils/generateSession";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { IoSend } from "react-icons/io5";
import { TbMessages, TbUser, TbMessageCircleOff } from "react-icons/tb";
import { RiRobot2Line } from "react-icons/ri";
import generateSugesstions from "../utils/generateSuggestions";
import { getThemeConfig, ThemeConfig } from "../theme";

interface Message {
  role: "user" | "bot";
  message: string;
  isError?: boolean;
}

interface SessionInterface {
  started: boolean;
  email: string;
  username: string;
  sessionId?: string;
}

interface ChatbotProps {
  chatbotDetails: {
    id: string;
    bussinessName: string;
    bussinessCategory: string;
    bussinessDescription: string;
    bussinessDetails: {
      question: string;
      answer: string;
    }[];
  };
  theme?: string;
  position?: "left" | "right";
  wantToShowSuggestions?: boolean;
  apiUrl: string;
  token: string;
  borderRadius?: string | number;
  toggleBtnRadius?: string | number;
  fontFamily?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({
  chatbotDetails,
  theme = "aptus",
  wantToShowSuggestions = false,
  apiUrl,
  token,
  borderRadius,
  toggleBtnRadius,
  fontFamily,
}) => {
  const [session, setSession] = useState<SessionInterface>({
    started: false,
    email: "",
    username: "",
    sessionId: "",
  });

  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", message: `Hello! Welcome to ${chatbotDetails?.bussinessName || "Aptus AI Support"}. How can I help you today?` },
  ]);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const themeConfig = getThemeConfig(theme, borderRadius, toggleBtnRadius, fontFamily);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  let bussinessDetails = "Bussiness Details :";
  bussinessDetails += "Bussiness Name : " + chatbotDetails.bussinessName + ",";
  bussinessDetails += "Bussiness Category : " + chatbotDetails.bussinessCategory + ",";
  bussinessDetails += "Bussiness Description : " + chatbotDetails.bussinessDescription + ",";
  bussinessDetails += "Questionaries :";
  chatbotDetails.bussinessDetails.forEach((item) => {
    bussinessDetails += item.question + " : " + item.answer + ",";
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    setShowSuggestions(false);
    if (input.trim() !== "" && !loading) {
      const updatedMessages: Message[] = [
        ...messages,
        { role: "user", message: input },
      ];
      setMessages(updatedMessages);
      const temp = input;
      setInput("");
      setLoading(true);

      try {
        const backendHistory = [];
        for (let i = 1; i < updatedMessages.length - 1; i += 2) {
          const userMsg = updatedMessages[i];
          const botMsg = updatedMessages[i + 1];
          if (userMsg && botMsg) {
            backendHistory.push({
              question: userMsg.message,
              answer: botMsg.message
            });
          }
        }

        const res = await axios.post(`${apiUrl}/chatbot/getResponse`, {
          messages: backendHistory,
          message: temp,
          session_id: session.sessionId,
          token: token
        });

        if (!res.data.success) {
          throw new Error("Failed to get response from AI");
        }

        const botMessageIndex = updatedMessages.length;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", message: "Typing..." },
        ]);

        let content = "";
        const typewriterEffect = async (text: string) => {
          for (let i = 0; i < text.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 10));
            content += text.charAt(i);
            setMessages((prevMessages) => [
              ...prevMessages.slice(0, botMessageIndex),
              { role: "bot", message: content },
            ]);
            scrollToBottom();
          }
        };

        setLoading(false);
        await typewriterEffect(res.data.data);

        if (wantToShowSuggestions && (content.includes("sorry") || content.includes("apologize") || content.includes("error") || content.includes("Sorry"))) {
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", message: "Sorry, something went wrong.", isError: true },
        ]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    } else if (input.trim() === "") {
      alert("Please enter a valid message");
    }
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (name.trim() !== "" && email.trim() !== "") {
      try {
        const response = await generateSession({
          email,
          username: name,
          token,
          apiUrl,
        });

        setSession({
          started: true,
          email,
          username: name,
          sessionId: response.session._id,
        });
      } catch (error) {
        console.error("Error starting session", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getSugesstionsList = async () => {
      if (wantToShowSuggestions && showSuggestions) {
        const suggestionsList = await generateSugesstions(bussinessDetails, apiUrl, token);
        setSuggestions(suggestionsList);
      }
    };

    getSugesstionsList();
  }, [wantToShowSuggestions, showSuggestions, bussinessDetails, apiUrl]);

  const handleSugesstionClick = async (sugg: string) => {
    if (loading) return;
    setInput(sugg);
    setShowSuggestions(false);
  };
  useEffect(() => {
    if (chatbotDetails?.bussinessName) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].role === "bot" && prev[0].message.startsWith("Hello! Welcome to")) {
          return [{ role: "bot", message: `Hello! Welcome to ${chatbotDetails.bussinessName}. How can I help you today?` }];
        }
        return prev;
      });
    }
  }, [chatbotDetails?.bussinessName]);

  const headerTitle = chatbotDetails?.bussinessName ? `${chatbotDetails.bussinessName}` : "Aptus AI Support";

  if (!session.started) {
    return (
      <ChatbotContainer $config={themeConfig}>
        <Header $config={themeConfig}>
          <AvatarCircle $bg="rgba(255, 255, 255, 0.2)" $color="inherit">
            <RiRobot2Line size={16} />
          </AvatarCircle>
          <span>{headerTitle}</span>
        </Header>

        <FormContainer onSubmit={handleStartSession} $config={themeConfig}>
          <WelcomeContainer $config={themeConfig}>
            <TbMessages size={80} />
          </WelcomeContainer>
          <FormInput
            $config={themeConfig}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
          <FormInput
            $config={themeConfig}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
          />
          <FormButton $config={themeConfig} type="submit" disabled={loading}>
            {loading ? "STARTING..." : "START CHAT"}
          </FormButton>
        </FormContainer>
      </ChatbotContainer>
    );
  }

  return (
    <ChatbotContainer $config={themeConfig}>
      <Header $config={themeConfig}>
        <AvatarCircle $bg="rgba(255, 255, 255, 0.2)" $color="inherit">
          <RiRobot2Line size={16} />
        </AvatarCircle>
        <span>{headerTitle}</span>
      </Header>

      <MessagesContainer ref={messagesContainerRef} $config={themeConfig}>
        {messages.map((message, index) => (
          message.role === "bot" ? (
            <BotMessageWrapper key={index} $config={themeConfig}>
              <AvatarCircle $bg="rgba(0, 0, 0, 0.08)" $color={themeConfig.botBubbleColor || '#1a1a1a'}>
                {message.isError ? (
                  <TbMessageCircleOff size={16} />
                ) : (
                  <RiRobot2Line size={16} />
                )}
              </AvatarCircle>
              <MessageBubble $config={themeConfig} role="bot">
                {message.message}
              </MessageBubble>
            </BotMessageWrapper>
          ) : (
            <UserMessageWrapper key={index} $config={themeConfig}>
              <MessageBubble $config={themeConfig} role="user">
                {message.message}
              </MessageBubble>
              <AvatarCircle $bg={themeConfig.userBubbleBg || '#007bff'} $color={themeConfig.userBubbleColor || '#ffffff'}>
                <TbUser size={16} />
              </AvatarCircle>
            </UserMessageWrapper>
          )
        ))}
        {showSuggestions && (
          <SuggestionsContainer>
            {suggestions.map((sugg, i) => (
              <Suggestion key={i} $config={themeConfig} onClick={() => handleSugesstionClick(sugg)}>
                {sugg}
              </Suggestion>
            ))}
          </SuggestionsContainer>
        )}
        {loading && (
          <BotMessageWrapper $config={themeConfig}>
            <AvatarCircle $bg="rgba(0, 0, 0, 0.08)" $color={themeConfig.botBubbleColor || '#1a1a1a'}>
              <RiRobot2Line size={16} />
            </AvatarCircle>
            <MessageBubble $config={themeConfig} role="bot">Typing...</MessageBubble>
          </BotMessageWrapper>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <ChatInputContainer $config={themeConfig}>
        <ChatInput
          $config={themeConfig}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder="Type a message..."
        />
        <SendButton $config={themeConfig} onClick={handleSendMessage}>
          <IoSend size={18} />
        </SendButton>
      </ChatInputContainer>
    </ChatbotContainer>
  );
};

export default Chatbot;

// Styled Components

const slideUp = keyframes`
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ChatbotContainer = styled.div<{ $config: ThemeConfig }>`
  width: 100%;
  height: 100%;
  background-color: ${({ $config }) => $config.containerBg};
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  font-family: ${({ $config }) => $config.fontFamily};
`;

const Header = styled.div<{ $config: ThemeConfig }>`
  background-color: ${({ $config }) => $config.headerBg};
  color: ${({ $config }) => $config.headerColor};
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.05em;
  letter-spacing: 0.3px;
  border-bottom: ${({ $config }) => $config.headerBorderBottom || 'none'};

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const FormContainer = styled.form<{ $config: ThemeConfig }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: ${({ $config }) => $config.containerBg};
`;

const WelcomeContainer = styled.div<{ $config: ThemeConfig }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $config }) => $config.inputColor || '#333333'};
  margin-bottom: 16px;
`;

const FormInput = styled.input<{ $config: ThemeConfig }>`
  width: 100%;
  max-width: 280px;
  font-family: inherit;
  padding: 10px 12px;
  margin: 6px 0;
  border-radius: ${({ $config }) => $config.inputRadius};
  outline: none;
  border: ${({ $config }) => $config.inputBorder};
  font-size: 0.9em;
  font-weight: 500;
  background-color: ${({ $config }) => $config.inputBg} !important;
  color: ${({ $config }) => $config.inputColor} !important;

  &:focus {
    outline: none;
    border: ${({ $config }) => $config.inputFocusBorder};
  }

  ::placeholder {
    color: #888888;
  }
`;

const FormButton = styled.button<{ $config: ThemeConfig }>`
  background-color: ${({ $config }) => $config.buttonBg};
  color: ${({ $config }) => $config.buttonColor};
  border: ${({ $config }) => $config.buttonBorder || 'none'};
  box-shadow: ${({ $config }) => $config.buttonShadow || 'none'};
  font-family: inherit;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: ${({ $config }) => $config.buttonRadius};
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  width: 100%;
  max-width: 280px;
  transition: transform 0.15s, background-color 0.15s;

  &:hover {
    background-color: ${({ $config }) => $config.buttonHoverBg};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const MessagesContainer = styled.div<{ $config: ThemeConfig }>`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: ${({ $config }) => $config.messagesBg};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

const AvatarCircle = styled.div<{ $bg?: string; $color?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ $bg }) => $bg || 'rgba(0, 0, 0, 0.08)'};
  color: ${({ $color }) => $color || 'inherit'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const BotMessageWrapper = styled.div<{ $config: ThemeConfig }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: flex-start;
  max-width: 90%;
  color: ${({ $config }) => $config.botBubbleColor || '#1a1a1a'};
  animation: ${slideUp} 0.25s ease-out;
`;

const UserMessageWrapper = styled.div<{ $config: ThemeConfig }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: flex-end;
  max-width: 90%;
  color: ${({ $config }) => $config.userBubbleBg || '#007bff'};
  animation: ${slideUp} 0.25s ease-out;
`;

const MessageBubble = styled.div<{ role: "user" | "bot"; $config: ThemeConfig }>`
  align-self: ${(props) => (props.role === "user" ? "flex-end" : "flex-start")};
  background-color: ${(props) =>
    props.role === "user" ? props.$config.userBubbleBg : props.$config.botBubbleBg};
  color: ${(props) =>
    props.role === "user" ? props.$config.userBubbleColor : props.$config.botBubbleColor};
  border: ${(props) =>
    props.role === "user"
      ? props.$config.userBubbleBorder || 'none'
      : props.$config.botBubbleBorder || 'none'};
  padding: 10px 14px;
  border-radius: ${({ $config }) => $config.bubbleRadius};
  max-width: ${(props) => (props.role === "user" ? "85%" : "100%")};
  font-weight: 500;
  font-size: 0.9em;
  animation: ${slideUp} 0.25s ease-out;
  line-height: 1.4;
`;

const ChatInputContainer = styled.div<{ $config: ThemeConfig }>`
  display: flex;
  padding: 12px;
  background-color: ${({ $config }) => $config.inputContainerBg};
  border-top: ${({ $config }) => $config.inputContainerBorderTop};
`;

const ChatInput = styled.input<{ $config: ThemeConfig }>`
  flex: 1;
  border: ${({ $config }) => $config.inputBorder};
  padding: 10px;
  border-radius: ${({ $config }) => $config.inputRadius};
  margin-right: 8px;
  outline: none;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9em;
  background-color: ${({ $config }) => $config.inputBg};
  color: ${({ $config }) => $config.inputColor};

  &:focus {
    outline: none;
    border: ${({ $config }) => $config.inputFocusBorder};
  }
`;

const SendButton = styled.button<{ $config: ThemeConfig }>`
  background-color: ${({ $config }) => $config.buttonBg};
  color: ${({ $config }) => $config.buttonColor};
  border: ${({ $config }) => $config.buttonBorder || 'none'};
  border-radius: ${({ $config }) => $config.buttonRadius};
  padding: 8px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, background-color 0.15s;

  &:hover {
    background-color: ${({ $config }) => $config.buttonHoverBg};
  }
  &:active {
    transform: translateY(1px);
  }
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0px;
  background-color: transparent;
  max-width: 90%;
  animation: ${slideUp} 0.25s ease-out;
`;

const Suggestion = styled.div<{ $config: ThemeConfig }>`
  background-color: ${({ $config }) => $config.suggestionBg};
  color: ${({ $config }) => $config.suggestionColor};
  border: ${({ $config }) => $config.suggestionBorder || 'none'};
  padding: 8px 12px;
  border-radius: ${({ $config }) => $config.bubbleRadius};
  font-size: 0.85em;
  font-weight: 600;
  animation: ${slideUp} 0.25s ease-out;
  cursor: pointer;
  transition: transform 0.15s;

  &:hover {
    transform: translateY(-2px);
  }
`;
