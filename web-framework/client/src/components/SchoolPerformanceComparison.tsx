import React, { useEffect, useState } from 'react';
import { School, SchoolPerformanceData} from '../types';
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

interface Props {
    selectedSchools: School[];
    onRemoveSchool: (schoolId: number) => void;
}

const SchoolPerformanceComparison: React.FC<Props> = ({ selectedSchools, onRemoveSchool }) => {
    const [performanceData, setPerformanceData] = useState<SchoolPerformanceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:5001/api/school-performance');
                setPerformanceData(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching performance data:', error);
                setError('Failed to load performance data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPerformanceData();
    }, []);

    const getPerformanceData = (schoolName: string): SchoolPerformanceData | undefined => {
        return performanceData.find(data => data.school_name === schoolName);
    };

    const formatPercentageData = () => {
        return selectedSchools
            .map(school => {
                const data = getPerformanceData(school.Name);
                if (!data) return null;
                return {
                    name: school.Name,
                    'Economically Disadvantaged': Number(data.economically_disadvantaged || 0),
                    'English Learners': Number(data.english_learner || 0),
                    'Special Education': Number(data.special_education || 0),
                };
            })
            .filter((data): data is NonNullable<typeof data> => data !== null);
    };

    const formatEnrollmentData = () => {
        return selectedSchools
            .map(school => {
                const data = getPerformanceData(school.Name);
                if (!data) return null;
                return {
                    name: school.Name,
                    'Enrollment': data.school_enrollment,
                    'Career & Technical Programs': data.career_and_technical_programs,
                };
            })
            .filter((data): data is NonNullable<typeof data> => data !== null);
    };

    if (isLoading) {
        return <div className="loading">Loading performance data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="comparison-section">
            <div className="selected-schools">
                {selectedSchools.map((school) => {
                    const perfData = getPerformanceData(school.Name);
                    if (!perfData) return null;

                    return (
                        <div key={school.id} className="school-item">
                            <span className="school-name">{school.Name}</span>
                            {/*<div className="school-details">*/}
                            {/*    <span>County: {perfData.county}</span>*/}
                            {/*    <span>ESSA Designation: {perfData.essa_school_designation}</span>*/}
                            {/*    <span>Title I: {perfData.title_i_school}</span>*/}
                            {/*</div>*/}
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

            {selectedSchools.length > 0 && performanceData.length > 0 && (
                <div className="charts-section">
                    <div className="chart-container">
                        <h3 className="chart-title">Student Demographics</h3>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <RadarChart data={formatPercentageData()}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="name" />
                                    <PolarRadiusAxis domain={[0, 100]} />
                                    <Radar
                                        name="Economically Disadvantaged"
                                        dataKey="Economically Disadvantaged"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.6}
                                    />
                                    <Radar
                                        name="English Learners"
                                        dataKey="English Learners"
                                        stroke="#82ca9d"
                                        fill="#82ca9d"
                                        fillOpacity={0.6}
                                    />
                                    <Radar
                                        name="Special Education"
                                        dataKey="Special Education"
                                        stroke="#ffc658"
                                        fill="#ffc658"
                                        fillOpacity={0.6}
                                    />
                                    <Legend />
                                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3 className="chart-title">Enrollment and Programs</h3>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart data={formatEnrollmentData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Enrollment" fill="#8884d8" />
                                    <Bar dataKey="Career & Technical Programs" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolPerformanceComparison;