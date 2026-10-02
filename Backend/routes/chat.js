import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const generateTitle = (message) => {
  const words = message.trim().split(/\s+/);

  if (words.length <= 4) {
    return message.trim();
  }

  return words.slice(0, 4).join(" ") + "...";
};


// Get all threads
router.get("/thread", authMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.userId }).sort({ updatedAt: -1 });
    // most recent data on top
    res.json(threads);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to fetch threads"
    });
  }
});


// Get messages of a particular thread
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId,
      userId: req.userId
    });

    if (!thread) {
      return res.status(400).json({
        error: "Thread not found!"
      });
    }

    res.json(thread.messages);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to fetch threads"
    });
  }
});


// Delete a thread
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.userId
    });

    if (!deletedThread) {
      return res.status(400).json({
        error: "Thread not found!"
      });
    }

    res.status(200).json({
      success: "Thread deleted successfully!"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to delete thread"
    });
  }
});


// Rename a thread
router.put("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Chat name is required!"
    });
  }

  try {
    const thread = await Thread.findOneAndUpdate(
      {
        threadId,
        userId: req.userId
      },
      {
        title: title
      },
      {
        new: true
      }
    );

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found!"
      });
    }

    res.json({
      message: "Chat renamed successfully!",
      title: thread.title
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to rename chat"
    });
  }
});


// Send message to ChatGPT
router.post("/chat", authMiddleware, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({
      error: "Missing required fields"
    });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      userId: req.userId
    });

    if (!thread) {
      thread = new Thread({
        threadId,
        userId: req.userId,
        title: generateTitle(message),
        messages: [
          {
            role: "user",
            content: message
          }
        ],
      });

    } else {
      thread.messages.push({
        role: "user",
        content: message
      });
    }

    const assistantReply = await getOpenAIAPIResponse(thread.messages);

    thread.messages.push({
      role: "assistant",
      content: assistantReply
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({
      reply: assistantReply,
      title: thread.title
    });

  } catch (err) {
    console.log("Chat Error:", err);

    res.status(500).json({
      error: err.message || "Something went wrong"
    });
  }
});


export default router;