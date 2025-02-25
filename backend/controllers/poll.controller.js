import Poll from "../models/poll.model.js";

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: "Invalid poll data" });
    }

    const poll = new Poll({
      question,
      options: options.map(text => ({ text, votes: 0 }))
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: "Invalid vote" });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
