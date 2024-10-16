import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Post {
    id:number;
  text: string;
}

const ViewPosts: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8086/employees/posts/${id}`);
      console.log('Fetched Posts:', response.data);
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Could not fetch posts. Please try again later.');
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when the component mounts
  }, [id]);

  return (
    <div>
      <h2>User Posts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post, index) => (
            <li key={index}>
                {post.text}     
                </li>
            
          ))
        )}
      </ul>
    </div>
  );
};

export default ViewPosts;
