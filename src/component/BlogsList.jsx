import React, { useState, useEffect } from "react";

const BlogPostList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [pagination, setPagination] = useState({});
  const [countries, setCountries] = useState([]); // Dynamic countries list

  useEffect(() => {
    fetchPosts(1); // Fetch posts starting from page 1
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/blogs/list-api/?page=${page}`);
      const data = await response.json();
      setPosts(data.data || []);
      setFilteredPosts(data.data || []);
      
      // Extract unique countries from posts
      const uniqueCountries = [...new Set(data.data.map((post) => post.country))];
      setCountries(uniqueCountries);

      setPagination({
        current: data.current_page || 1,
        total: data.total_pages || 1,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const filterPosts = (country) => {
    setCountryFilter(country);
    if (country) {
      setFilteredPosts(posts.filter((post) => post.country === country));
    } else {
      setFilteredPosts(posts);
    }
  };

  return (
    <div>
      <header className="text-center py-10 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
        <h1 className="text-5xl font-semibold">Blog Posts</h1>
      </header>

      {/* Filter Section */}
      <div className="max-w-lg mx-auto mb-10 p-6 bg-white shadow-lg rounded-lg">
        <label htmlFor="country-filter" className="text-xl font-semibold text-gray-700">
          Filter by Country:
        </label>
        <select
          id="country-filter"
          name="country"
          onChange={(e) => filterPosts(e.target.value)}
          className="mt-4 block w-full p-3 rounded-md border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
        >
          <option value="">All Countries</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Blog Post Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div
              key={index}
              className="post-card bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
              data-country={post.country}
            >
              <div className="mb-4">
                <i className="fas fa-map-marker-alt text-teal-500 mr-2"></i>
                <span className="font-semibold text-gray-700">{post.country}</span>
              </div>
              <h2 className="text-2xl font-semibold text-teal-600 mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-5">
                {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
              </p>
              <p className="text-sm text-gray-500">
                <em>Published on: {new Date(post.created_at).toLocaleDateString()}</em>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-red-500">No blog posts available.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-4">
        {pagination.current > 1 && (
          <>
            <button
              onClick={() => fetchPosts(1)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition"
            >
              « First
            </button>
            <button
              onClick={() => fetchPosts(pagination.current - 1)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition"
            >
              Previous
            </button>
          </>
        )}
        <span className="px-6 py-3 bg-teal-500 text-white rounded-lg">
          Page {pagination.current} of {pagination.total}
        </span>
        {pagination.current < pagination.total && (
          <>
            <button
              onClick={() => fetchPosts(pagination.current + 1)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition"
            >
              Next
            </button>
            <button
              onClick={() => fetchPosts(pagination.total)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition"
            >
              Last »
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPostList;
