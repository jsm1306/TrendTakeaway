import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import moment from "moment";

interface DiscussionProps {
  discussion: {
    _id: string;
    user: { name: string; sub: string; picture?: string };
    text: string;
    likes: string[];
    replies: DiscussionProps["discussion"][];
    createdAt: string;
  };
}

const Discussion: React.FC<DiscussionProps> = ({ discussion }) => {
  const [likes, setLikes] = useState(discussion.likes.length);
  const [replies, setReplies] = useState(discussion.replies);
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const { user } = useAuth0();

  const userId = user?.sub;
  const hasLiked = discussion.likes.includes(userId || "");

  useEffect(() => {
    setReplies(discussion.replies);
  }, [discussion.replies]);

  const handleLike = async () => {
    if (!user) return;
    try {
      await axios.post(`http://localhost:5000/api/discussions/${discussion._id}/like`, {
        user: { name: user.name, sub: user.sub, picture: user.picture },
      });
      setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking discussion:", error);
    }
  };

  const handleReply = async () => {
    if (!user || !replyText.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/discussions/${discussion._id}/reply`,
        {
          user: { name: user.name, sub: user.sub },
          text: replyText,
        }
      );

      setReplies((prevReplies) => [...prevReplies, response.data]); // Append reply
      setReplyText("");
      setShowReplyInput(false);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <div className=" w-full border p-4 mb-6 rounded-lg bg-gray-800 text-white shadow-lg">
      <div className="flex items-center mb-3">
        
        <div>
          <p className="font-semibold">{discussion.user.name}</p>
          <p className="text-xs text-gray-400">{moment(discussion.createdAt).fromNow()}</p>
        </div>
      </div>

      <p className="text-lg">{discussion.text}</p>

      <div className="flex items-center mt-3 space-x-6">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded text-sm transition ${
            hasLiked ? "bg-blue-500 text-white" : "bg-gray-600 text-gray-300"
          }`}
        >
          👍 {likes} {hasLiked ? "Unlike" : "Like"}
        </button>
        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="text-sm text-black hover:text-gray-300  transition"
        >
          💬 Reply
        </button>
      </div>
      {showReplyInput && (
        <div className="mt-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border p-3 rounded bg-gray-900 text-white"
            placeholder="Write a reply..."
          />
          <button
            onClick={handleReply}
            className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700"
          >
            Reply
          </button>
        </div>
      )}
      {replies.length > 0 && (
        <div className="mt-4 border-l-4 border-gray-600 pl-4">
          {replies.map((reply) => (
            <Discussion key={reply._id} discussion={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussion;
//need to update profile image, fix the like button, crud operations for replies
//stylize the discussion component, solve parent child cmnt problem