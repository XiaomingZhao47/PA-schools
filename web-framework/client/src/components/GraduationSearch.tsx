import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { GraduationData } from '../types';
import '../styles/GraduationAnalysis.css';

interface Props {
    graduationData: GraduationData[];
    onSchoolSelect: (school: GraduationData) => void;
    selectedSchools: GraduationData[];
}

const GraduationSearch: React.FC<Props> = ({ graduationData, onSchoolSelect, selectedSchools }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<GraduationData[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length > 0) {
            const filtered = graduationData
                .filter(school =>
                    school.district_name.toLowerCase().includes(term.toLowerCase()) ||
                    school.county.toLowerCase().includes(term.toLowerCase())
                )
                .slice(0, 10);
            setSearchResults(filtered);
            setShowDropdown(true);
        } else {
            // show top 10 districts
            const topDistricts = [...graduationData]
                .sort((a, b) => (b.four_year_cohort || 0) - (a.four_year_cohort || 0))
                .slice(0, 10);
            setSearchResults(topDistricts);
            setShowDropdown(true);
        }
    };

    return (
        <div className="search-container">
            <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search by district name or county..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                />

                {showDropdown && (
                    <div className="search-results">
                        <div className="search-header">
                            {searchTerm ? 'Search Results' : 'Top 10 Districts by Size'}
                        </div>
                        {searchResults.map((school) => (
                            <div key={school.district_name} className="search-result-item">
                                <div className="district-info">
                                    <div className="district-name">{school.district_name}</div>
                                    <div className="district-county">{school.county} County</div>
                                </div>
                                <button
                                    className="add-button"
                                    onClick={() => {
                                        onSchoolSelect(school);
                                        setShowDropdown(false);
                                    }}
                                    disabled={selectedSchools.some(s => s.district_name === school.district_name)}
                                >
                                    {selectedSchools.some(s => s.district_name === school.district_name)
                                        ? 'Added'
                                        : 'Add to Compare'
                                    }
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraduationSearch;