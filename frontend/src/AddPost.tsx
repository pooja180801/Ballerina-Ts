import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Post {
  text: string;
}



const AddPost: React.FC = () => {
   const { id } = useParams<{ id: string }>();
  const [postForm, setPostForm] = useState<Post>({
    text: '',
  });

  const navigate=useNavigate();

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (postForm.text.trim()) {
      try {
        // Send the post data to an API (replace the URL with the correct one)
        await axios.post(`http://localhost:8086/employees/addPost/${id}`, postForm);
        
        console.log('Post added:', postForm);
        
        // Clear the form after successfully adding the post
        setPostForm({ text: '' });
        navigate('/');
      } catch (error) {
        console.error('Error adding post:', error);
      }
    } else {
      console.log('Post cannot be empty');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostForm({ ...postForm, [name]: value });

  };

  return (
    <div style={{ margin: '20px', textAlign: 'center' }}>
      <h2>Add a New Post</h2>
      <form onSubmit={handleAddPost}>
        <textarea
          name="text"  // Make sure this name matches the postForm key
          value={postForm.text}
          onChange={handleChange}
          placeholder="Write your post here"
          rows={5}
          style={{ width: '300px', marginBottom: '10px' }}
        />
        <br />
        <button
          type="submit"
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
