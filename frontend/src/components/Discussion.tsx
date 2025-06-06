import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import moment from "moment";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";

interface DiscussionProps {
  discussion: {
    _id: string;
    user: { name: string; sub: string; picture?: string };
    text: string;
    likes: string[];
    replies: DiscussionProps["discussion"][];
    createdAt: string;
  };
  onDelete?: (id: string) => void;
  onReply?: () => void;
  onEdit?: (id: string, newText: string) => void;
}
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const Discussion: React.FC<DiscussionProps> = ({
  discussion,
  onDelete,
  onReply,
  onEdit,
}) => {
  const [likes, setLikes] = useState(
    Array.isArray(discussion.likes) ? discussion.likes.length : 0
  );
  const [hasLiked, setHasLiked] = useState(false);
  const [replies, setReplies] = useState(discussion.replies);
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(discussion.text);
  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      setHasLiked(discussion.likes.includes(user.sub));
    }
    setReplies(discussion.replies);
  }, [discussion.likes, discussion.replies, user]);

  const handleLike = async () => {
    if (!user) return;
    try {
      await axios.post(`${baseURL}/discussions/${discussion._id}/like`, {
        user: { name: user.name, sub: user.sub },
      });
      setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
      setHasLiked((prev) => !prev);
    } catch (error) {
      console.error("Error liking discussion:", error);
    }
  };

  const handleReply = async () => {
    if (!user || !replyText.trim()) return;

    try {
      const response = await axios.post(
        `${baseURL}/discussions/${discussion._id}/reply`,
        {
          user: { name: user.name, sub: user.sub, picture: user.picture },
          text: replyText,
        }
      );

      setReplies([...replies, response.data]);
      setReplyText("");
      setShowReplyInput(false);
      onReply && onReply();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleDelete = async () => {
    if (!user || user.sub !== discussion.user.sub) {
      return console.error("You are not authorized to delete this discussion");
    }

    try {
      await axios.delete(`${baseURL}/discussions/${discussion._id}`);
      if (onDelete) onDelete(discussion._id);
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  const handleEdit = async () => {
    if (!user || user.sub !== discussion.user.sub) return;

    try {
      await axios.put(`${baseURL}/discussions/${discussion._id}`, {
        text: updatedText,
      });

      setIsEditing(false);
      onEdit && onEdit(discussion._id, updatedText);
    } catch (error) {
      console.error("Error updating discussion:", error);
    }
  };

  return (
    <div className="w-full border p-6 mb-6 rounded-lg bg-gray-900 text-white shadow-lg pl-6 pr-20 ">
      <div className="flex items-center mb-4 space-x-4">
        {discussion.user.picture ? (
          <img
            src={discussion.user.picture}
            alt={`${discussion.user.name}'s profile`}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl">
            {discussion.user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-lg">{discussion.user.name}</p>
          <p className="text-xs text-gray-400">
            {moment(discussion.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
            className="w-full border p-3 rounded bg-gray-800 text-white resize-none"
            rows={4}
          />
          <div className="mt-3 flex space-x-3">
            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-lg whitespace-pre-wrap">{discussion.text}</p>
      )}

      <div className="flex items-center mt-5 space-x-6">
        <button
          onClick={handleLike}
          className={`px-5 py-2 rounded text-sm flex items-center space-x-2 transition ${
            hasLiked ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"
          }`}
        >
          <AiOutlineLike />
          <span>{likes}</span>
        </button>
        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="text-sm text-gray-900 hover:text-gray-600 transition"
        >
          💬 Reply
        </button>

        {user && user.sub === discussion.user.sub && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-400 hover:text-yellow-500 flex items-center space-x-1 cursor-pointer"
            >
              <MdModeEditOutline />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
            >
              <MdDelete />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>

      {showReplyInput && (
        <div className="mt-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border p-3 rounded bg-gray-800 text-white resize-none"
            placeholder="Write a reply..."
            rows={3}
          />
          <button
            onClick={handleReply}
            className="bg-blue-600 text-black px-5 py-2 mt-3 rounded hover:bg-blue-700 transition"
          >
            Reply
          </button>
        </div>
      )}

      {replies && replies.length > 0 && (
        <div className="mt-6 pl-6 border-blue-500 relative">
          {replies.map((reply, index) =>
            reply && reply.user ? (
              <div
                key={reply._id || index}
                className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-500"
              >
                <Discussion discussion={reply} onDelete={onDelete} />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default Discussion;
