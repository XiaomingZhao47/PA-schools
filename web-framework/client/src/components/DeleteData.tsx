import React, { useState } from 'react';
import axios from 'axios';

// define the props
interface AddDataFormProps {
    refreshSchools: () => Promise<void>;
}

const DeleteData: React.FC<AddDataFormProps> = ({ refreshSchools }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            await axios.delete('http://localhost:5000/api/data/*');
            alert("Deleted All Data!")

            refreshSchools()
        } catch (error) {
            console.error('err:', error);
        }
    };

    return (
        <div>
             <div>
                <h2>Delete All Schools</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <button type="submit">Delete Data</button>
            </form>
        </div>
    );
};

export default DeleteData;
