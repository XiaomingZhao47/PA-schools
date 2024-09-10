import React from 'react';
import DisplayData from './components/DisplayData';
import AddDataForm from './components/AddDataForm';
import './App.css';

function App() {
  return (
    <div>
      <h1>SQLite + React (TypeScript) CRUD App</h1>
      <AddDataForm />
      <DisplayData />
    </div>
  );
}

export default App;
