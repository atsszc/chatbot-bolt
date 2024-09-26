import { Request, Response } from 'express';
import ChatSession from '../models/ChatSession';

const questions = [
  "What is your favorite breed of cat, and why?",
  "How do you think cats communicate with their owners?",
  "Have you ever owned a cat? If so, what was their name and personality like?",
  "Why do you think cats love to sleep in small, cozy places?",
  "What’s the funniest or strangest behavior you’ve ever seen a cat do?",
  "Do you prefer cats or kittens, and what’s the reason for your preference?",
  "Why do you think cats are known for being independent animals?",
  "How do you think cats manage to land on their feet when they fall?",
  "What’s your favorite fact or myth about cats?",
  "How would you describe the relationship between humans and cats in three words?",
];

// Yeni oturum başlatma
export const startChatSession = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const chatSession = new ChatSession({
      userId,
      questions: questions.map(question => ({ question, answer: '' })),
    });

    await chatSession.save();

    res.status(201).json(chatSession);
  } catch (err) {
    res.status(500).json({ error: 'Chat session could not be started' });
  }
};

// Soruları ve cevapları güncelleme
export const updateChatSession = async (req: Request, res: Response) => {
  const { userId, questionIndex, answer } = req.body;

  try {
    const chatSession = await ChatSession.findOne({ userId });

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    chatSession.questions[questionIndex].answer = answer;

    if (questionIndex === questions.length - 1) {
      chatSession.endTime = new Date();
    }

    await chatSession.save();

    res.status(200).json(chatSession);
  } catch (err) {
    res.status(500).json({ error: 'Chat session could not be updated' });
  }
};
