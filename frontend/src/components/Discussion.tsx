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
    if (!user) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/discussions/${discussion._id}/reply`,
        {
          user: { name: user.name, sub: user.sub, picture: user.picture },
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
    <div className="border p-4 mb-4 rounded-lg bg-gray-100 w-3/4 mx-auto"> 
      <div className="flex items-center mb-2 text-black">
        {discussion.user.picture && (
          <img src={discussion.user.picture} alt="Profile" className="w-10 h-10 rounded-full mr-2 text-black" />
        )}
        <div>
          <p className="font-bold">{discussion.user.name}</p>
          <p className="text-xs text-gray-500">{moment(discussion.createdAt).fromNow()}</p>
        </div>
      </div>

      <p className="text-gray-800">{discussion.text}</p>

      <div className="flex items-center mt-2">
        <button onClick={handleLike} className="text-blue-500 mr-4">
          👍 {likes} {hasLiked ? "(Unlike)" : "(Like)"}
        </button>
        <button onClick={() => setShowReplyInput(!showReplyInput)} className="text-gray-600">
          💬 Reply
        </button>
      </div>
      {showReplyInput && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border p-2 rounded text-black"
            placeholder="Write a reply..."
          />
          <button onClick={handleReply} className="bg-gray-500 text-white px-4 py-2 mt-1 rounded">
            Reply
          </button>
        </div>
      )}
      {replies.length > 0 && (
        <div className="mt-4 pl-6 border-l-2 border-gray-300">
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