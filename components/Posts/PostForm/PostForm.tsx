"use client";

import React, { useState, useEffect } from "react";
import { IPost } from "../../../interface/IPosts";

interface PostFormProps {
  isEditing: boolean;
  currentPost: IPost | null;
  onSave: (post: IPost) => void;
}

const PostForm: React.FC<PostFormProps> = ({
  isEditing,
  currentPost,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (isEditing && currentPost) {
      setTitle(currentPost.title);
      setBody(currentPost.body);
    }
  }, [isEditing, currentPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && body) {
      const newPost: IPost = currentPost
        ? { ...currentPost, title, body }
        : { id: Date.now(), title, body };
      onSave(newPost);
      setTitle("");
      setBody("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5 w-[50%]">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="block w-full px-4 py-2 mb-2 border border-gray-300 rounded-full outline-none"
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        className="block w-full h-[150px] px-4 py-2 mb-2 border border-gray-300 rounded-3xl outline-none"
      ></textarea>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
      >
        {isEditing ? "Update Post" : "Add Post"}
      </button>
    </form>
  );
};

export default PostForm;
