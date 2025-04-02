import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Discussion from "../components/Discussion";

interface DiscussionType {
  _id: string;
  user: { name: string; sub: string };
  text: string;
  likes: string[];
  replies: DiscussionType[];
  createdAt: string;
}

const DiscussionPage: React.FC = () => {
  const [discussions, setDiscussions] = useState<DiscussionType[]>([]);
  const [newDiscussion, setNewDiscussion] = useState("");
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      fetchDiscussions();
    }
  }, [isAuthenticated]);

  const fetchDiscussions = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/discussions");
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.trim()) return;
    if (!isAuthenticated || !user)
      return console.error("User not authenticated");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/discussions",
        {
          user: { name: user.name, sub: user.sub },
          text: newDiscussion,
        }
      );

      setNewDiscussion(""); // Clear input
      fetchDiscussions(); // Refetch updated discussions
    } catch (error) {
      console.error(
        "Error creating discussion:",
        error.response?.data || error
      );
    }
  };

  const handleDeleteDiscussion = (id: string) => {
    setDiscussions((prev) =>
      prev.filter((discussion) => discussion._id !== id)
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center text-red-500">
        You need to log in to view the discussions.
      </div>
    );
  }
  const handleEditDiscussion = (id: string, newText: string) => {
    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion._id === id ? { ...discussion, text: newText } : discussion
      )
    );
  };
  return (
    <div className="p-6 max-w-2xl mx-auto mt-4 ml-14">
      <h1 className="text-2xl font-bold mt-4 ml-6">Discussions</h1>
      <div className="mb-4">
        <textarea
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
          placeholder="Start a discussion..."
          className="w-full border rounded p-2 text-black"
        />
        <button
          onClick={handleCreateDiscussion}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Post
        </button>
      </div>
      {discussions.map(
        (discussion, index) =>
          !discussion.parentId && (
            <Discussion
              key={discussion._id || index}
              discussion={discussion}
              onDelete={handleDeleteDiscussion}
              onEdit={handleEditDiscussion}
            />
          )
      )}
    </div>
  );
};

export default DiscussionPage;
