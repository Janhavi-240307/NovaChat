import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Get all threads
router.get("/thread", authMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.userId }).sort({ updatedAt: -1 });
    //most recent data on top
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, userId: req.userId });
    if (!thread) {
      return res.status(400).json({ error: "Thread not found!" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.userId });

    if (!deletedThread) {
      return res.status(400).json({ error: "Thread not found!" });
    }
    res.status(200).json({ success: "Thread deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.put("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Chat name is required!" });
  }

  try {

    const thread = await Thread.findOneAndUpdate(
      {
        threadId,
        userId: req.userId
      },
      { title: title },
      { new: true }
    );

    if (!thread) {
      return res.status(404).json({ error: "Thread not found!" });
    }

    res.json({
      message: "Chat renamed successfully!",
      title: thread.title
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to rename chat" });
  }
})

router.post("/chat", authMiddleware, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId, userId: req.userId });

    if (!thread) {
      thread = new Thread({
        threadId,
        userId: req.userId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
export default router;
