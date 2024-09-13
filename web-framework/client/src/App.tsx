import React, { useState, useEffect } from 'react';
import SearchComponent from './components/SearchComponent';
import DisplayData from './components/DisplayData';
import AddDataForm from './components/AddDataForm'
import DeleteData from './components/DeleteData'
import UpdateDataForm from './components/UpdateDataForm'
import './App.css';
import axios from "axios";

interface School {
  id: number;
  school_name: string;
  location: string;
}

const App: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);

  // get schools from the database
  const fetchSchools = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/data');
      setSchools(response.data);
    } catch (error) {
      console.error('error fetching school data:', error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div>
      <h1>School Management</h1>
      <AddDataForm refreshSchools={fetchSchools} />  { }
      <SearchComponent />
      <DisplayData schools={schools} refreshSchools={fetchSchools} />  { }
      <DeleteData refreshSchools={fetchSchools}/>
      <UpdateDataForm/>
    </div>
  );
};

export default App;
