import React, { useState } from 'react';
import axios from 'axios';

const AddDataForm: React.FC = () => {
    const [school_name, setSchoolName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/data', { school_name, location });
            setSchoolName('');
            setLocation('');
            alert('add school successfully');
        } catch (error) {
            console.error('err:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>School Name:</label>
                <input type="text" value={school_name} onChange={(e) => setSchoolName(e.target.value)} />
            </div>
            <div>
                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <button type="submit">Add School</button>
        </form>
    );
};

export default AddDataForm;
