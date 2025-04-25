import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Discussion from "../components/Discussion";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
    if (isAuthenticated) fetchDiscussions();
  }, [isAuthenticated]);

  const fetchDiscussions = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/discussions`);
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.trim() || !user || !isAuthenticated) return;

    try {
      await axios.post(`${baseUrl}/discussions`, {
        user: { name: user.name, sub: user.sub },
        text: newDiscussion,
      });

      setNewDiscussion("");
      fetchDiscussions();
    } catch (error: any) {
      console.error(
        "Error creating discussion:",
        error.response?.data || error
      );
    }
  };

  const handleDeleteDiscussion = (id: string) => {
    setDiscussions((prev) => prev.filter((d) => d._id !== id));
  };

  const handleEditDiscussion = (id: string, newText: string) => {
    setDiscussions((prev) =>
      prev.map((d) => (d._id === id ? { ...d, text: newText } : d))
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center text-red-500">
        You need to log in to view the discussions.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-4 ml-4">
      <h1 className="text-2xl font-bold mb-14">Discussions</h1>

      <div className="mb-8">
        <textarea
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
          placeholder="Start a discussion..."
          className="w-full border rounded p-3 text-black"
        />
        <button
          onClick={handleCreateDiscussion}
          className="bg-blue-500 text-white px-4 py-2 mt-2 mb-12 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </div>

      {discussions.map((discussion) => (
        <Discussion
          key={discussion._id}
          discussion={discussion}
          onDelete={handleDeleteDiscussion}
          onEdit={handleEditDiscussion}
        />
      ))}
    </div>
  );
};

export default DiscussionPage;
