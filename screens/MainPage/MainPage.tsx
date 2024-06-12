"use client";
import { useState, useEffect, FC } from "react";
import { IPost } from "../../interface/IPosts";
import PostForm from "../../components/Posts/PostForm/PostForm";
import PostList from "../../components/Posts/PostList/PostList";
import Search from "../../ui/Search/Search";
import { PostService } from "../../service/posts.service";
import { NextPage } from "next";

const MainPage: FC<NextPage> = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<IPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const savePostsToLocalStorage = (posts: IPost[]) => {
    localStorage.setItem("posts", JSON.stringify(posts));
  };

  const getTodos = async () => {
    const data = await PostService.fetchData();
    setPosts(data);
    setLoading(false);
  };

  const addPost = (post: IPost) => {
    let updatedPosts;
    if (isEditing && currentPost) {
      updatedPosts = posts.map((p) => (p.id === currentPost.id ? post : p));
      setIsEditing(false);
      setCurrentPost(null);
    } else {
      updatedPosts = [post, ...posts];
    }
    setPosts(updatedPosts);
    savePostsToLocalStorage(updatedPosts);
  };

  const editPost = (post: IPost) => {
    setIsEditing(true);
    setCurrentPost(post);
  };

  const deletePost = (postId: number) => {
    const filteredPosts = posts.filter((post) => post.id !== postId);
    setPosts(filteredPosts);
    savePostsToLocalStorage(filteredPosts);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
      setLoading(false);
    } else {
      getTodos();
    }
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      savePostsToLocalStorage(posts);
    }
  }, [posts]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container flex justify-around h-screen ">
      <div className="w-[50%] ml-12">
        <h1 className="text-3xl text-start font-medium my-5">Post Blog</h1>
        <PostForm
          isEditing={isEditing}
          currentPost={currentPost}
          onSave={addPost}
        />
      </div>
      <div className="w-[50%] mt-11 px-6 ">
        <h1 className="text-4xl mb-6">All Blogs</h1>
        <Search searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <PostList
          posts={currentPosts}
          onEdit={editPost}
          onDelete={deletePost}
        />
        <div className="flex justify-center items-center mt-5 w-5 border-solid-red">
          {[
            ...Array(Math.ceil(filteredPosts.length / postsPerPage)).keys(),
          ].map((number) => (
            <button
              key={number}
              onClick={() => paginate(number + 1)}
              className={`mx-1 px-4 py-1 rounded-md ${
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

export default MainPage;
