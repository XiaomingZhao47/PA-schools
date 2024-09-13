import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface School {
    id: number;
    school_name: string;
    location: string;
}

interface DisplayDataProps {
    schools: School[];
    refreshSchools: () => void;
}

const DisplayData: React.FC<DisplayDataProps> = ({ schools, refreshSchools }) => {
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:5000/api/data/${id}`);
            refreshSchools();
        } catch (error) {
            console.error('Error deleting school:', error);
        }
    };

    return (
        <div>
            <h2>School List</h2>
            <ul>
                {schools.map((school) => (
                    <li key={school.id}>
                        {school.id}: {school.school_name} - Located in {school.location}
                        <button onClick={() => handleDelete(school.id)}>Delete</button> {}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DisplayData;
