import User from '../models/user.model.js';


export const createUser = async (req, res) => {
  try {
    const { sub, name, email, picture } = req.body; // Extract data from Auth0

    let user = await User.findOne({ auth0Id: sub });

    if (!user) {
      user = new User({ auth0Id: sub, name, email, picture });
      await user.save();
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserByAuth0Id = async (req, res) => {
  const { auth0Id } = req.params;

  try {
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
