import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface DiscussionProps {
  discussion: {
    _id: string;
    user: { name: string; sub: string };
    text: string;
    likes: string[];
    replies: DiscussionProps["discussion"][];
  };
}

const Discussion: React.FC<DiscussionProps> = ({ discussion }) => {
  const [likes, setLikes] = useState(discussion.likes.length);
  const [replies, setReplies] = useState(discussion.replies);
  const [replyText, setReplyText] = useState("");
  const { user } = useAuth0();

  const userId = user?.sub;
  const hasLiked = discussion.likes.includes(userId || "");

  const handleLike = async () => {
    if (!user) return;
    try {
      await axios.post(`http://localhost:5000/api/discussions/${discussion._id}/like`, {
        user: { name: user.name, sub: user.sub },
      });
      setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking discussion:", error);
    }
  };

  const handleReply = async () => {
    console.log("Replying to Discussion...");  

    if (!user) {
      console.log("User not logged in!"); 
      return;
    }

    console.log("Sending reply:", replyText); 
    try {
      const response = await fetch(`http://localhost:5000/api/discussions/${discussion._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { name: user.name, sub: user.sub },
          text: replyText
        }),
      });

      const data = await response.json();
      console.log("Reply Response:", data);

      setReplies([...replies, data]);
      setReplyText("");
    } catch (error) {
      console.error("Error posting reply:", error); 
    }
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <p className="font-bold">{discussion.user.name}</p>
      <p>{discussion.text}</p>
      <div className="flex items-center mt-2">
        <button onClick={handleLike} className="text-blue-500 mr-2">
          👍 {likes} {hasLiked ? "(Unlike)" : "(Like)"}
        </button>
        <button onClick={() => setReplyText("")} className="text-gray-600">💬 Reply</button>
      </div>
      {replyText !== "" && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => { console.log("Typing:", e.target.value); setReplyText(e.target.value); }}
            className="w-full border p-2 rounded"
            placeholder="Write a reply..."
          />
          <button onClick={handleReply} className="bg-gray-500 text-white px-4 py-2 mt-1 rounded">
            Reply
          </button>
        </div>
      )}
      {replies.length > 0 && (
        <div className="mt-4 border-l pl-4">
          {replies.map((reply) => (
            <Discussion key={reply._id} discussion={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussion;