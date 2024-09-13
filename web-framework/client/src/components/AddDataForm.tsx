import React, { useState } from 'react';
import axios from 'axios';

// Define the props for AddDataForm
interface AddDataFormProps {
    refreshSchools: () => Promise<void>; // Function to refresh the school list
}

const AddDataForm: React.FC<AddDataFormProps> = ({ refreshSchools }) => {
    const [school_name, setSchoolName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send POST request to add new school
            await axios.post('http://localhost:5000/api/data', { school_name, location });

            // Clear input fields after successful submission
            setSchoolName('');
            setLocation('');

            // Refresh the school list in the parent component
            refreshSchools();
        } catch (error) {
            console.error('Error adding school:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>School Name:</label>
                <input
                    type="text"
                    value={school_name}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add School</button>
        </form>
    );
};

export default AddDataForm;
