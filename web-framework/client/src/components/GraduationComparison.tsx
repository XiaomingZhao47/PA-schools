import React from 'react';
import { GraduationData } from '../types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import '../styles/GraduationAnalysis.css';

interface Props {
    selectedSchools: GraduationData[];
    onRemoveSchool: (school: GraduationData) => void;
}

const GraduationComparison: React.FC<Props> = ({ selectedSchools, onRemoveSchool }) => {
    // Helper function to format percentage numbers
    const formatPercentage = (value: number): string => {
        return value ? `${Number(value).toFixed(1)}%` : '0%';
    };

    const formatData = (schools: GraduationData[]) => {
        return schools.map(school => ({
            name: school.district_name,
            '4 Year Rate': Number((school.four_year_grads / school.four_year_cohort * 100) || 0),
            '5 Year Rate': Number((school.five_year_grads / school.five_year_cohort * 100) || 0),
            '6 Year Rate': Number((school.six_year_grads / school.six_year_cohort * 100) || 0),
        }));
    };

    const formatDemographicData = (schools: GraduationData[]) => {
        return schools.map(school => ({
            name: school.district_name,
            'White': Number(school.four_year_white_rate || 0),
            'Black': Number(school.four_year_black_rate || 0),
            'Hispanic': Number(school.four_year_hispanic_rate || 0),
            'Economically Disadvantaged': Number(school.four_year_econ_disadvantaged_rate || 0),
        }));
    };

    return (
        <div className="comparison-section">
            {selectedSchools.map((school) => (
                <div key={school.district_name} className="district-card fade-in">
                    <div className="district-header">
                        <h3 className="district-title">{school.district_name}</h3>
                        <button
                            className="remove-button"
                            onClick={() => onRemoveSchool(school)}
                        >
                            Remove
                        </button>
                    </div>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <h4 className="metric-header">Demographics</h4>
                            <div className="space-y-3">
                                <div className="metric-bar">
                                    <span className="metric-label">White:</span>
                                    <div className="metric-progress">
                                        <div
                                            className="metric-value white-bar"
                                            style={{width: `${school.four_year_white_rate || 0}%`}}
                                        >
                                            {formatPercentage(school.four_year_white_rate)}
                                        </div>
                                    </div>
                                </div>
                                <div className="metric-bar">
                                    <span className="metric-label">Black:</span>
                                    <div className="metric-progress">
                                        <div
                                            className="metric-value black-bar"
                                            style={{width: `${school.four_year_black_rate || 0}%`}}
                                        >
                                            {formatPercentage(school.four_year_black_rate)}
                                        </div>
                                    </div>
                                </div>
                                <div className="metric-bar">
                                    <span className="metric-label">Hispanic:</span>
                                    <div className="metric-progress">
                                        <div
                                            className="metric-value hispanic-bar"
                                            style={{width: `${school.four_year_hispanic_rate || 0}%`}}
                                        >
                                            {formatPercentage(school.four_year_hispanic_rate)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="metric-card">
                            <h4 className="metric-header">Economic Status</h4>
                            <div className="metric-bar">
                                <span className="metric-label">Disadvantaged:</span>
                                <div className="metric-progress">
                                    <div
                                        className="metric-value disadvantaged-bar"
                                        style={{width: `${school.four_year_econ_disadvantaged_rate || 0}%`}}
                                    >
                                        {formatPercentage(school.four_year_econ_disadvantaged_rate)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {selectedSchools.length > 0 && (
                <div className="charts-section">
                    <div className="chart-container">
                        <h3 className="chart-title">Graduation Rates Comparison</h3>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart data={formatData(selectedSchools)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                                    <Legend />
                                    <Bar dataKey="4 Year Rate" fill="#8884d8" />
                                    <Bar dataKey="5 Year Rate" fill="#82ca9d" />
                                    <Bar dataKey="6 Year Rate" fill="#ffc658" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3 className="chart-title">Demographic Performance</h3>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <RadarChart data={formatDemographicData(selectedSchools)}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="name" />
                                    <PolarRadiusAxis domain={[0, 100]} />
                                    <Radar name="White" dataKey="White" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    <Radar name="Black" dataKey="Black" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                    <Radar name="Hispanic" dataKey="Hispanic" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                                    <Radar name="Economically Disadvantaged" dataKey="Economically Disadvantaged" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
                                    <Legend />
                                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GraduationComparison;