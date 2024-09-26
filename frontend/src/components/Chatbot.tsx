import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, TextField } from "@mui/material";

const Chatbot: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  interface Message {
    sender: string;
    text: string;
    timestamp?: string;
  }

  useEffect(() => {
    const startSession = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/chat/start', { userId: 'user1' });
        setSessionId(response.data._id);
        await fetchQuestion(response.data._id);
      } catch (error) {
        console.error("Oturum başlatma hatası", error);
      }
    };

    startSession();
  }, []);

  const fetchQuestion = async (id: string) => {
    const response = await axios.get(`http://localhost:5000/api/chat/question/${id}`);
    if (response.data.question) {
      const existingQuestion = messages.find(message => message.text === response.data.question);

      if (!existingQuestion) {
        const questionMessage: Message = {
          sender: 'bot',
          text: response.data.question,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, questionMessage]);
      }

      setLoading(false);
    } else {
      const finishedMessage: Message = {
        sender: 'bot',
        text: 'Questions Over. Welcome to Bolt Insight!',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, finishedMessage]);
      setFinished(true);
    }
  };


  const handleAnswerSubmit = async () => {
    if (answer.trim()) {
      const userMessage: Message = { sender: 'user', text: answer, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, userMessage]);

      try {
        await axios.post(`http://localhost:5000/api/chat/answer/${sessionId}`, { answer });
        if (sessionId) {
          await fetchQuestion(sessionId); 
        }
      } catch (error) {
        console.error("Cevap gönderme hatası", error);
      }

      setAnswer(''); 
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };


  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          />
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            Answer 10 questions about cats. The chatbot will record your answers for you.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Bolt Insight - Chatbot Model
        </Typography>
        <Box
          ref={messageContainerRef}
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            paddingBottom: 10,
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                maxWidth: '80%',
                bgcolor: msg.sender === 'user' ? 'rgb(0, 123, 255)' : 'rgb(34, 34, 34)',
                color: 'white',
                borderRadius: '10px',
                padding: '10px',
                margin: '5px',
              }}
            >
              <Typography>
                {msg.text} <br />
                {msg.timestamp ? (
                  <small>{new Date(msg.timestamp).toLocaleString()}</small>
                ) : (
                  <small>Tarih mevcut değil</small>
                )}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            marginTop: 2,
          }}
        >
          <TextField
            inputRef={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              flex: 1,
              bgcolor: "rgb(17, 27, 39)",
              color: "white",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "lightblue",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "lightblue",
                },
              },
            }}
          />
          <Button
            onClick={handleAnswerSubmit}
            variant="contained"
            sx={{ ml: 2 }}
          >
            SEND
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatbot;
