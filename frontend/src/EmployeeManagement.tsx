import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeeManagement.css'; // Import the CSS file

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeForm, setEmployeeForm] = useState<Omit<Employee, 'id'>>({
    name: '',
    position: '',
    department: '',
    salary: 0,
  });

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8086/employees/all');
      console.log('Fetched Employees:', response.data);
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Could not fetch employees. Please try again later.');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmployeeForm({ ...employeeForm, [name]: name === 'salary' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const employeeData = {
      ...employeeForm,
      salary: parseFloat(employeeForm.salary.toString()),
    };

    try {
      if (isEditing && editingEmployeeId !== null) {
        await axios.put(`http://localhost:8086/employees/id`, { ...employeeData, id: editingEmployeeId });
        setIsEditing(false);
        setEditingEmployeeId(null);
      } else {
        await axios.post('http://localhost:8086/employees/employee', employeeData);
      }

      setEmployeeForm({ name: '', position: '', department: '', salary: 0 });
      fetchEmployees();
      setError(null);
    } catch (error) {
      console.error('Error during submission:', error);
      setError('Could not add/update employee. Please check the input and try again.');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEmployeeForm({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
    });
    setIsEditing(true);
    setEditingEmployeeId(employee.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8086/employees/id?id=${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error during deletion:', error);
      setError('Could not delete employee.');
    }
  };

  const addPost = async (id: number) => {
    navigate(`/addPost/${id}`);
  };

  const viewPost = async (id: number) => {
    navigate(`/posts/${id}`);
  };

  return (
    <div className="container"> {/* Add container class */}
      <h1>Employee Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={employeeForm.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={employeeForm.position}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={employeeForm.department}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={employeeForm.salary}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Employee</button>
      </form>

      <h2>Employee List</h2>
      <ul>
        {(Array.isArray(employees) ? employees : []).map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.position} - {employee.department} - ${employee.salary}
            <div>
              <button onClick={() => handleEdit(employee)}>Edit</button>
              <button onClick={() => handleDelete(employee.id)}>Delete</button>
              <button onClick={() => addPost(employee.id)}>Add Post</button>
              <button onClick={() => viewPost(employee.id)}>View Posts</button>
            </div>
          </li>
        ))}
      </ul>
      {error && <p className="error">{error}</p>} {/* Apply error class */}
    </div>
  );
};

export default EmployeeManagement;
