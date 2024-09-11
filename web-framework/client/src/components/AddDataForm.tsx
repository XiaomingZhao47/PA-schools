import React, { useState } from 'react';
import axios from 'axios';

const AddDataForm: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/data', { name, age });
      setName('');
      setAge(0);
      alert('added user successful');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
      </div>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddDataForm;
