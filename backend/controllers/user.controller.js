import User from '../models/user.model.js';

// Create or update user after Auth0 login
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

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user (Optional, e.g., update role)
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user (Optional)
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
