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
      await axios.post(
        `http://localhost:5000/api/discussions/${discussion._id}/like`,
        {
          user: { name: user.name, sub: user.sub, picture: user.picture },
        }
      );
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
        `http://localhost:5000/api/discussions/${discussion._id}/reply`,
        { user: { name: user.name, sub: user.sub }, text: replyText }
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
      await axios.delete(
        `http://localhost:5000/api/discussions/${discussion._id}`
      );
      if (onDelete) onDelete(discussion._id);
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  const handleEdit = async () => {
    if (!user || user.sub !== discussion.user.sub) return;

    try {
      await axios.put(
        `http://localhost:5000/api/discussions/${discussion._id}`,
        {
          text: updatedText,
        }
      );

      setIsEditing(false);
      onEdit && onEdit(discussion._id, updatedText);
    } catch (error) {
      console.error("Error updating discussion:", error);
    }
  };

  return (
    <div className="w-full border p-4 mb-6 rounded-lg bg-gray-800 text-white shadow-lg">
      <div className="flex items-center mb-3">
        {discussion.user.picture && (
          <img
            src={discussion.user.picture}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <div>
          <p className="font-semibold">{discussion.user.name}</p>
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
            className="w-full border p-2 rounded bg-gray-900 text-white"
          />
          <button
            onClick={handleEdit}
            className="bg-green-500 text-white px-3 py-1 mt-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-2 bg-gray-600 text-white px-3 py-1 mt-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <p className="text-lg">{discussion.text}</p>
      )}

      <div className="flex items-center mt-3 space-x-6">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded text-sm flex items-center space-x-2 transition ${
            hasLiked ? "bg-blue-500 text-white" : "bg-gray-600 text-gray-300"
          }`}
        >
          <AiOutlineLike />
          <span>{likes}</span>
        </button>
        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="text-sm text-black hover:text-gray-300 transition"
        >
          💬 Reply
        </button>

        {user && user.sub === discussion.user.sub && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-500 hover:text-yellow-600 flex items-center space-x-1 cursor-pointer"
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

      {replies && replies.length > 0 && (
        <div className="mt-4 border-l-4 border-gray-600 pl-4">
          {replies.map((reply, index) => (
            <Discussion
              key={reply._id || index}
              discussion={reply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussion;
