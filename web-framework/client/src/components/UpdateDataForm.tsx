import React, { useState } from 'react'
import axios from 'axios'

// define the props
interface AddDataFormProps {
    refreshSchools: () => Promise<void>;
}

const UpdateDataForm: React.FC<AddDataFormProps> = ({ refreshSchools }) => {
    const [ school_name, setSchoolName ] = useState('')
    const [ location, setLocation ] = useState('')
    const [ id, setID ] = useState('')


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:5001/api/data/${id}`, { school_name, location })
            setSchoolName('')
            setLocation('')
            setID('')
            alert('Updated School successfully')
            refreshSchools()
        } catch (error) {
            console.error('err:', error)
        }
    }

    return (
        <div>
            <h2>Update Schools</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID: </label>
                    <input type="text" value={id} onChange={(e) => setID(e.target.value)} />
                </div>
                <div>
                    <label>New School Name: </label>
                    <input type="text" value={school_name} onChange={(e) => setSchoolName(e.target.value)} />
                </div>
                <div>
                    <label>New Location: </label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <button type="submit">Update School</button>
            </form>
        </div>
    )
}

export default UpdateDataForm
