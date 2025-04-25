import Discussion from "../models/discussion.model.js";

export const getDiscussions = async (req, res) => {
  try {
    let discussions = await Discussion.find()
      .populate("user", "name")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name" },
      })
      .sort({ createdAt: -1 });

    // Create a map of discussions by id
    const discussionMap = new Map();
    discussions.forEach((discussion) => {
      discussionMap.set(discussion._id.toString(), discussion.toObject());
    });

    // Set to keep track of reply IDs
    const replyIds = new Set();

    // Replace replies array of ObjectIds with actual discussion objects
    discussionMap.forEach((discussion) => {
      if (discussion.replies && discussion.replies.length > 0) {
        discussion.replies = discussion.replies.map((reply) => {
          replyIds.add(reply._id.toString());
          return discussionMap.get(reply._id.toString());
        });
      }
    });

    // Filter out discussions that are replies (i.e., those in replyIds)
    const topLevelDiscussions = [];
    discussionMap.forEach((discussion, id) => {
      if (!replyIds.has(id)) {
        topLevelDiscussions.push(discussion);
      }
    });

    res.json(topLevelDiscussions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!user || !text)
      return res.status(400).json({ error: "Missing fields" });

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
    if (!discussion)
      return res.status(404).json({ error: "Discussion not found" });

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
    if (!discussion)
      return res.status(404).json({ error: "Discussion not found" });

    const hasLiked = discussion.likes.includes(user.sub);
    if (hasLiked) {
      discussion.likes = discussion.likes.filter((sub) => sub !== user.sub);
    } else {
      discussion.likes.push(user.sub);
    }

    await discussion.save();
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDiscussion = await Discussion.findByIdAndDelete(id);
    if (!deletedDiscussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }
    res.json({ message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateDiscussion = async (req, res) => {
  try {
    const { text } = req.body;
    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );
    res.json(updatedDiscussion);
  } catch (err) {
    res.status(500).json({ error: "Failed to update discussion" });
  }
};
