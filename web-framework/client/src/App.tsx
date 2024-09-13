import React from 'react'
import Search from './components/SearchComponent'
import DisplayData from './components/DisplayData'
import AddDataForm from './components/AddDataForm'
import DeleteData from './components/DeleteData'
import UpdateDataForm from './components/UpdateDataForm'
import './App.css'

function App() {
  return (
    <div>
      <h1>PA schools Searcher</h1>
      <Search />
      <DisplayData />
      <AddDataForm />
      <DeleteData />
      <UpdateDataForm/>
    </div>
  );
}

export default App
