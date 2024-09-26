import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';

export const startChatSession = async (userId: string) => {
  return await axios.post(`${API_URL}/start`, { userId });
};

export const updateChatSession = async (userId: string, questionIndex: number, answer: string) => {
  return await axios.put(`${API_URL}/update`, { userId, questionIndex, answer });
};
