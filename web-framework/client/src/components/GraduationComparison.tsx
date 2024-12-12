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
    const [allGraduationData, setAllGraduationData] = useState<GraduationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all graduation data once
    useEffect(() => {
        const fetchGraduationData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:5001/api/graduation-rates');
                setAllGraduationData(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching graduation data:', error);
                setError('Failed to load graduation data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGraduationData();
    }, []);

    const getGraduationData = (districtName: string): GraduationData | undefined => {
        return allGraduationData.find(data => data.district_name === districtName);
    };

    const formatPercentage = (value: number): string => {
        return value ? `${Number(value).toFixed(1)}%` : '0%';
    };

    const formatData = () => {
        return selectedSchools
            .map(school => {
                const data = getGraduationData(school.DistrictName);
                if (!data) return null;
                return {
                    name: school.Name,
                    '4 Year Rate': Number((data.four_year_grads / data.four_year_cohort * 100) || 0),
                    '5 Year Rate': Number((data.five_year_grads / data.five_year_cohort * 100) || 0),
                    '6 Year Rate': Number((data.six_year_grads / data.six_year_cohort * 100) || 0),
                };
            })
            .filter((data): data is NonNullable<typeof data> => data !== null);
    };

    const formatDemographicData = () => {
        return selectedSchools
            .map(school => {
                const data = getGraduationData(school.DistrictName);
                if (!data) return null;
                return {
                    name: school.Name,
                    'White': Number(data.four_year_white_rate || 0),
                    'Black': Number(data.four_year_black_rate || 0),
                    'Hispanic': Number(data.four_year_hispanic_rate || 0),
                    'Economically Disadvantaged': Number(data.four_year_econ_disadvantaged_rate || 0),
                };
            })
            .filter((data): data is NonNullable<typeof data> => data !== null);
    };

    if (isLoading) {
        return <div className="loading">Loading graduation data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="comparison-section">
            <div className="selected-schools">
                {selectedSchools.map((school) => {
                    const gradData = getGraduationData(school.DistrictName);
                    if (!gradData) return null;

                    return (
                        <div key={school.id} className="school-item">
                            <span className="school-name">{school.Name}</span>
                            <button
                                className="remove-button"
                                onClick={() => onRemoveSchool(school.id)}
                            >
                                Remove
                            </button>
                        </div>
                    );
                })}
            </div>

            {selectedSchools.length > 0 && allGraduationData.length > 0 && (
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