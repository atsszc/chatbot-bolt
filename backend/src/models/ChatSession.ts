import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      answer: { type: String, default: '' },
      timestamp: { type: Date, default: Date.now }, 
    },
  ],
  endTime: { type: Date, default: null }, 
}, { timestamps: true });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;
