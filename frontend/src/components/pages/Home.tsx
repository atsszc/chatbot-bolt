import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import TypingAnim from "../typer/TypingAnim";
import robotImage from "../../assets/robot.png"; 
import openaiImage from "../../assets/openai.png"; 
import chatImage from "../../assets/chat.png"; 

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate(); 

  const handleStart = () => {
    navigate("/chat"); 
  };

  return (
    <Box width={"100%"} height={"100%"}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: "auto", mt: 3 }}>
        <Box>
          <TypingAnim />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { md: "row", xs: "column", sm: "column" },
            gap: 5,
            my: 10,
            alignItems: "center",
          }}
        >
          <img src={robotImage} alt="robot" style={{ width: "200px", margin: "auto" }} />
          <Button variant="contained" color="primary" onClick={handleStart} sx={{ mx: 2 }}>
            Start
          </Button>
          <img src={openaiImage} alt="openai" style={{ width: "200px", margin: "auto" }} />
        </Box>
        <Box sx={{ display: "flex", mx: "auto" }}>
          <img
            src={chatImage}
            alt="chatbot"
            style={{
              display: "flex",
              margin: "auto",
              width: isBelowMd ? "80%" : "60%",
              borderRadius: 20,
              boxShadow: "-5px -5px 105px #64f3d5",
              marginTop: 20,
              marginBottom: 20,
              padding: 10,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
