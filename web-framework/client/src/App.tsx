import React from 'react';
import Search from './components/SearchComponent';
import DisplayData from './components/DisplayData';
import AddDataForm from './components/AddDataForm';
import './App.css';

function App() {
  return (
    <div>
      <h1>PA schools Searcher</h1>
      <Search />
      <AddDataForm />
      <DisplayData />

    </div>
  );
}

export default App;
