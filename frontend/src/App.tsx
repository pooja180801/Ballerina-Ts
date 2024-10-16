import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddPost from './AddPost';
import EmployeeManagement from './EmployeeManagement';
import ViewPosts from './ViewPosts';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeManagement />} />
        <Route path="/addPost/:id" element={<AddPost />} />
        <Route path="/posts/:id" element={<ViewPosts />} />
      </Routes>
    </Router>
  );
};

export default App;
