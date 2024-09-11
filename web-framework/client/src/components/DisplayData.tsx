import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface School {
    id: number;
    school_name: string;
    location: string;
}


const DisplayData: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/data')
            .then(response => setSchools(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2>School List</h2>
            <ul>
                {schools.map((school) => (
                    <li key={school.id}>
                        {school.school_name} - Located in {school.location}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DisplayData;
