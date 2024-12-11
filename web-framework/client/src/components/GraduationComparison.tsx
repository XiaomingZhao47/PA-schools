import React, { useEffect, useState } from 'react';
import { School, GraduationData } from '../types';
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
import axios from 'axios';
import '../styles/GraduationAnalysis.css';

interface Props {
    selectedSchools: School[];
    onRemoveSchool: (schoolId: number) => void;
}

const GraduationComparison: React.FC<Props> = ({ selectedSchools, onRemoveSchool }) => {
    const [graduationData, setGraduationData] = useState<Map<string, GraduationData>>(new Map());

    useEffect(() => {
        const fetchGraduationData = async () => {
            const newGraduationData = new Map<string, GraduationData>();

            for (const school of selectedSchools) {
                try {
                    const response = await axios.get(
                        `http://localhost:5001/api/graduation-rates/${school.DistrictName}`
                    );
                    newGraduationData.set(school.DistrictName, response.data);
                } catch (error) {
                    console.error(`Error fetching graduation data for ${school.Name}:`, error);
                }
            }

            setGraduationData(newGraduationData);
        };

        fetchGraduationData();
    }, [selectedSchools]);

    const formatPercentage = (value: number): string => {
        return value ? `${Number(value).toFixed(1)}%` : '0%';
    };

    const formatData = () => {
        return selectedSchools
            .filter(school => graduationData.has(school.DistrictName))
            .map(school => {
                const data = graduationData.get(school.DistrictName)!;
                return {
                    name: school.Name,
                    '4 Year Rate': Number((data.four_year_grads / data.four_year_cohort * 100) || 0),
                    '5 Year Rate': Number((data.five_year_grads / data.five_year_cohort * 100) || 0),
                    '6 Year Rate': Number((data.six_year_grads / data.six_year_cohort * 100) || 0),
                };
            });
    };

    const formatDemographicData = () => {
        return selectedSchools
            .filter(school => graduationData.has(school.DistrictName))
            .map(school => {
                const data = graduationData.get(school.DistrictName)!;
                return {
                    name: school.Name,
                    'White': Number(data.four_year_white_rate || 0),
                    'Black': Number(data.four_year_black_rate || 0),
                    'Hispanic': Number(data.four_year_hispanic_rate || 0),
                    'Economically Disadvantaged': Number(data.four_year_econ_disadvantaged_rate || 0),
                };
            });
    };

    return (
        <div className="comparison-section">
            {selectedSchools.map((school) => {
                const gradData = graduationData.get(school.DistrictName);
                if (!gradData) return null;

                return (
                    <div key={school.id} className="district-card fade-in">
                        <div className="district-header">
                            <h3 className="district-title">{school.Name}</h3>
                            <button
                                className="remove-button"
                                onClick={() => onRemoveSchool(school.id)}
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
                                                style={{width: `${gradData.four_year_white_rate || 0}%`}}
                                            >
                                                {formatPercentage(gradData.four_year_white_rate)}
                                            </div>
                                        </div>
                                    </div>
                                <div className="metric-bar">
                                    <span className="metric-label">Black:</span>
                                    <div className="metric-progress">
                                        <div
                                            className="metric-value black-bar"
                                            style={{width: `${gradData.four_year_black_rate || 0}%`}}
                                        >
                                            {formatPercentage(gradData.four_year_black_rate)}
                                        </div>
                                    </div>
                                </div>
                                <div className="metric-bar">
                                    <span className="metric-label">Hispanic:</span>
                                    <div className="metric-progress">
                                        <div
                                            className="metric-value hispanic-bar"
                                            style={{width: `${gradData.four_year_hispanic_rate || 0}%`}}
                                        >
                                            {formatPercentage(gradData.four_year_hispanic_rate)}
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
                                        style={{width: `${gradData.four_year_econ_disadvantaged_rate || 0}%`}}
                                    >
                                        {formatPercentage(gradData.four_year_econ_disadvantaged_rate)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}

            {selectedSchools.length > 0 && graduationData.size > 0 && (
                <div className="charts-section">
                    <div className="chart-container">
                        <h3 className="chart-title">Graduation Rates Comparison</h3>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart data={formatData()}>
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
                                <RadarChart data={formatDemographicData()}>
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