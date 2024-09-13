import React, { useState } from 'react';
import axios from 'axios';

//
interface School {
    id: number;
    school_name: string;
    location: string;
}

const SearchComponent: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<School[]>([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/data/search?q=${searchQuery}`);
            setResults(response.data);
        } catch (error) {
            console.error('err:', error);
        }
    };

    return (
        <div>
            <h2>Search Schools</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search by school name"
            />
            <button onClick={handleSearch}>Search</button>

            <ul>
                {results.map((school) => (
                    <li key={school.id}>
                        {school.school_name} - Located in {school.location}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;
