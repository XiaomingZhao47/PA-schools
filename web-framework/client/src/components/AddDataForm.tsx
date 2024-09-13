import React, { useState } from 'react';
import axios from 'axios';

// define the props
interface AddDataFormProps {
    refreshSchools: () => Promise<void>;
}

const AddDataForm: React.FC<AddDataFormProps> = ({ refreshSchools }) => {
    const [school_name, setSchoolName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            await axios.post('http://localhost:5001/api/data', { school_name, location });

            setSchoolName('');
            setLocation('');

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
