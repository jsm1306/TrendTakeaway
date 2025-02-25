import Discussion from "../models/discussion.model.js";

export const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate("user", "name")
      .populate("replies")
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!user || !text) return res.status(400).json({ error: "Missing fields" });

    const discussion = new Discussion({
      user: { name: user.name, sub: user.sub },
      text,
    });

    await discussion.save();
    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const replyToDiscussion = async (req, res) => {
  try {
    const { user, text } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ error: "Discussion not found" });

    const reply = new Discussion({ user, text });
    await reply.save();
    
    discussion.replies.push(reply._id);
    await discussion.save();

    res.json(reply);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const likeDiscussion = async (req, res) => {
  try {
    const { user } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ error: "Discussion not found" });

    const hasLiked = discussion.likes.includes(user.sub);
    if (hasLiked) {
      discussion.likes = discussion.likes.filter(sub => sub !== user.sub);
    } else {
      discussion.likes.push(user.sub);
    }

    await discussion.save();
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

