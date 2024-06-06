"use client";
import { useState, useEffect, FormEvent } from "react";
import { Icon } from "@iconify-icon/react";
// Define the type for Post
type Post = {
  id: number;
  title: string;
  body: string;
};

const Home = () => {
  // Define state variables
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Fetch posts from localStorage or API on component mount
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    if (savedPosts.length) {
      setPosts(savedPosts);
      setLoading(false);
    } else {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())

        .then((data) => {
          console.log("Fetched data:", data);
          setPosts(data);

          setLoading(false);
        });
    }
  }, []);

  // Save posts to localStorage whenever the posts state changes
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts]);

  // Add or update a post
  const addPost = (e: FormEvent) => {
    e.preventDefault();
    if (isEditing && currentPost) {
      // Update existing post
      const updatedPosts = posts.map((post) =>
        post.id === currentPost.id ? { ...post, title, body } : post
      );
      setPosts(updatedPosts);
      setIsEditing(false);
      setCurrentPost(null);
    } else {
      // Add new post
      const newPost = { id: Date.now(), title, body };
      setPosts([newPost, ...posts]);
    }
    setTitle("");
    setBody("");
  };

  // Edit a post
  const editPost = (post: Post) => {
    setIsEditing(true);
    setCurrentPost(post);
    setTitle(post.title);
    setBody(post.body);
  };

  // Delete a post
  const deletePost = (postId: number) => {
    const filteredPosts = posts.filter((post) => post.id !== postId);
    setPosts(filteredPosts);
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Display loading indicator while fetching posts
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 flex justify-evenly h-screen">
      <div className="w-[30%] my-8">
        <h1 className="text-3xl  text-start font-medium my-5">Post Blog </h1>
        <form onSubmit={addPost} className="mb-5 ">
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
      </div>
      <div className="w-[50%] mt-11    px-6">
        <h1 className="text-4xl mb-6">All Blogs</h1>
        <input
          type="text"
          placeholder="Search Posts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full px-4 py-2 mb-5 border border-gray-300  rounded-full  outline-none"
        />
        <div className="h-[calc(100vh_-_250px)] overflow-auto">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="mb-5 p-4 border rounded-md shadow-sm  overflow-auto hover:bg-slate-100"
            >
              <h2 className="text-2xl font-bold capitalize">{post.title}</h2>
              <p className="text-gray-500 line-clamp-4">{post.body}</p>

              <div className="flex justify-end  ">
                <button
                  onClick={() => editPost(post)}
                  className=" flex items-center justify-center text-white py-1 px-2 rounded-md hover:bg-slate-300"
                >
                  <Icon
                    icon="uil:edit"
                    width="25px"
                    height="30px"
                    style={{ color: "blueviolet" }}
                  />
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="flex items-center justify-center text-white py-1 px-2 rounded-md hover:bg-slate-300"
                >
                  <Icon
                    icon="bi:trash"
                    width="25px"
                    height="30px"
                    style={{ color: "red" }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-5">
          {[
            ...Array(Math.ceil(filteredPosts.length / postsPerPage)).keys(),
          ].map((number) => (
            <button
              key={number}
              onClick={() => paginate(number + 1)}
              className={`mx-1 px-3 py-1 rounded-md ${
                currentPage === number + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {number + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
