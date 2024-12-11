// components/GraduationSearch.tsx
import React, { useState } from 'react';
import { GraduationData } from '../types';

interface Props {
    graduationData: GraduationData[];
    onSchoolSelect: (school: GraduationData) => void;
    selectedSchools: GraduationData[];
}

const GraduationSearch: React.FC<Props> = ({ graduationData, onSchoolSelect, selectedSchools }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<GraduationData[]>([]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length > 2) {
            const filtered = graduationData.filter(school =>
                school.district_name.toLowerCase().includes(term.toLowerCase()) ||
                school.county.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className="search-container p-4">
            <div className="search-box mb-4">
                <input
                    type="text"
                    placeholder="Search by district name or county..."
                    className="w-full p-2 border rounded"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {searchResults.length > 0 && (
                <div className="search-results">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">District</th>
                            <th className="p-2 text-left">County</th>
                            <th className="p-2 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {searchResults.map((school) => (
                            <tr key={school.district_name} className="border-b">
                                <td className="p-2">{school.district_name}</td>
                                <td className="p-2">{school.county}</td>
                                <td className="p-2 text-center">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => onSchoolSelect(school)}
                                        disabled={selectedSchools.some(s => s.district_name === school.district_name)}
                                    >
                                        Add to Compare
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GraduationSearch;