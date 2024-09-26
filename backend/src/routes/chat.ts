import express, { Request, Response } from 'express';
import Session from '../models/ChatSession';

const router = express.Router();

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
router.post('/start', async (req: Request, res: Response) => {
  const newSession = new Session({
    userId: req.body.userId,
    questions: []  
  });

  await newSession.save();
  res.status(201).json(newSession);  
});


// Soru alma
router.get('/question/:id', async (req: Request, res: Response) => {
  const sessionId = req.params.id;
  const session = await Session.findById(sessionId);

  if (!session) {
    return res.status(404).json({ message: "Oturum bulunamadı" });
  }

  if (session.questions.length >= questions.length) {
    return res.json({ message: "Tüm sorular cevaplandı", answers: session.questions });
  }

  const currentQuestion = questions[session.questions.length];
  res.json({ question: currentQuestion });
});

// Cevap kaydetme
router.post('/answer/:id', async (req: Request, res: Response) => {
  const sessionId = req.params.id;
  const session = await Session.findById(sessionId);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const { answer } = req.body;
  const currentQuestion = questions[session.questions.length];

  if (currentQuestion) {
    session.questions.push({ question: currentQuestion, answer });
    session.updatedAt = new Date();
    await session.save();

    res.json({ message: 'Answer saved', nextQuestion: questions[session.questions.length] });
  } else {
    res.json({ message: "All questions answered", answers: session.questions });
  }
});


export default router;
