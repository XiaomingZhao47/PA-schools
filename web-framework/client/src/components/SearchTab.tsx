import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SearchTab.css';

interface SearchSchool {
    school_id: number;
    school_name: string;
    school_address_city: string;
    district_name: string;
    county: string;
    total_enrollment: number;
    grades: string;
    title_i_school: string;
    economically_disadvantaged: number;
    english_learner: number;
    special_education: number;
}

interface SearchTabProps {
    onSchoolSelect: (school: SearchSchool) => void;
    selectedSchools: SearchSchool[];
}

const ITEMS_PER_PAGE = 10;

const SearchTab: React.FC<SearchTabProps> = ({ onSchoolSelect, selectedSchools }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchSchool[]>([]);
    const [activeTab, setActiveTab] = useState('school');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = async (term: string, sortBy: string = activeTab) => {
        setSearchTerm(term);
        setCurrentPage(1);

        if (term.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5001/api/schools/search?term=${encodeURIComponent(term)}&sortBy=${sortBy}`
            );
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching schools:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        if (searchTerm.length >= 2) {
            handleSearch(searchTerm, tabId);
        }
    };

    const isSchoolSelected = (schoolId: number) => {
        return selectedSchools.some(school => school.school_id === schoolId);
    };

    const tabs = [
        { id: 'school', icon: 'school', label: 'School' },
        { id: 'district', icon: 'district', label: 'District' },
        { id: 'city', icon: 'map-marker', label: 'City' },
        { id: 'county', icon: 'county', label: 'County' },
        { id: 'grades', icon: 'grades', label: 'Grades' },
        { id: 'enrollment', icon: 'enrollment', label: 'Enrollment' }
    ];

    const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentResults = searchResults.slice(startIndex, endIndex);

    return (
        <div className="search-container">
            <div className="search-header">
                <h1>PA School OneSearch</h1>
                <p>Compare and Explore Pennsylvania Schools by Any Criteria</p>
            </div>

            <div className="search-tabs">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`search-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        <i className={`fas fa-${tab.icon}`}></i>
                        {tab.label}
                    </div>
                ))}
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder={`Search for Schools by Name, District, City, or County...`}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                />
                <button className="search-button">
                    <i className="fas fa-search"></i>
                </button>
            </div>

            {isLoading ? (
                <div className="search-loading">
                    <div className="search-spinner"></div>
                    <span>Searching...</span>
                </div>
            ) : searchResults.length > 0 ? (
                <div className="search-results">
                    <div className="search-table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>School</th>
                                <th>District</th>
                                <th>City</th>
                                <th>County</th>
                                <th>Grades</th>
                                <th>Enrollment</th>
                                <th>Compare</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentResults.map((school) => (
                                <tr key={school.school_id}>
                                    <td>{school.school_name}</td>
                                    <td>{school.district_name}</td>
                                    <td>{school.school_address_city}</td>
                                    <td>{school.county}</td>
                                    <td>{school.grades}</td>
                                    <td>{school.total_enrollment?.toLocaleString()}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="search-checkbox"
                                            checked={isSchoolSelected(school.school_id)}
                                            onChange={() => onSchoolSelect(school)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="search-pagination">
                            <button
                                className="search-pagination-button"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className="search-page-info">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="search-pagination-button"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : searchTerm.length >= 2 && (
                <div className="search-no-results">
                    No schools found matching your search criteria
                </div>
            )}
        </div>
    );
};

export default SearchTab;