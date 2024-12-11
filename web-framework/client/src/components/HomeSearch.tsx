import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface School {
    school_name: string;
    district_name: string;
    city: string;
    total_enrollment: number;
}

interface HomeSearchProps {
    demographicData: School[];
    graduationData: any[];
}

const HomeSearch: React.FC<HomeSearchProps> = ({ demographicData, graduationData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<School[]>([]);
    const navigate = useNavigate();

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) {
            setSearchResults([]);
            return;
        }

        const results = demographicData.filter(school =>
            school.school_name.toLowerCase().includes(term.toLowerCase()) ||
            school.district_name.toLowerCase().includes(term.toLowerCase()) ||
            school.city.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 10);

        setSearchResults(results);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        School Demographics & Performance Analysis
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Search and analyze school demographics, graduation rates, and performance metrics
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by school name, district, or city..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    {searchResults.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold mb-3">Search Results:</h2>
                            <div className="space-y-2">
                                {searchResults.map((school, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                                        onClick={() => navigate(`/compare?school=${encodeURIComponent(school.school_name)}`)}
                                    >
                                        <div className="font-medium text-gray-800">{school.school_name}</div>
                                        <div className="text-sm text-gray-600">
                                            District: {school.district_name} | City: {school.city}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Total Enrollment: {school.total_enrollment.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/demographics')}
                            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                        >
                            <h3 className="font-semibold text-blue-800">Demographics Analysis</h3>
                            <p className="text-sm text-blue-600">Explore detailed demographic data for schools</p>
                        </button>
                        <button
                            onClick={() => navigate('/graduation-rates')}
                            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-all"
                        >
                            <h3 className="font-semibold text-green-800">Graduation Rates</h3>
                            <p className="text-sm text-green-600">Compare graduation rates across schools</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSearch;