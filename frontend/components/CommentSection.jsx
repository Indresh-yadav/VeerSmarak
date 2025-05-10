import { useState } from "react";
import API from "../src/api";

const CommentSection = ({ heroId, comments, setComments, setCommentCount }) => {
  const [newComment, setNewComment] = useState("");

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    await API.post(`hero/heroes/${heroId}/comment`, { message: newComment });
    setNewComment("");

    const newComments = [...comments, {
      user: { name: "You" }, 
      message: newComment,
      createdAt: new Date()
    }];
    setComments(newComments);
    setCommentCount(newComments.length);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow p-2 border rounded"
        />
        <button onClick={handleComment} className="bg-blue-500 text-white px-4 rounded">
          Post
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((c, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded">
            <p className="text-sm font-bold">{c.user?.name || "Anonymous"}</p>
            <p>{c.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
