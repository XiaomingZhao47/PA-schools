import React, { useEffect, useState } from 'react';
import { School, FinancialData } from '../types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import axios from 'axios';

interface Props {
    selectedSchools: School[];
    onRemoveSchool: (schoolId: number) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const FinancialAnalysisComparison: React.FC<Props> = ({ selectedSchools, onRemoveSchool }) => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:5001/api/financial-analysis');
                setFinancialData(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching financial data:', error);
                setError('Failed to load financial data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFinancialData();
    }, []);

    const getFinancialData = (districtName: string): FinancialData | undefined => {
        return financialData.find(data => data.district_name === districtName);
    };

    const formatRevenueData = () => {
        return selectedSchools
            .map(school => {
                const data = getFinancialData(school.DistrictName);
                if (!data) return null;
                return {
                    name: school.Name,
                    'Local Taxes': data.local_taxes / 1000000, // Convert to millions
                    'State Revenue': data.state_revenue / 1000000,
                    'Federal Revenue': data.federal_revenue / 1000000
                };
            })
            .filter((data): data is NonNullable<typeof data> => data !== null);
    };

    const formatExpenditureData = () => {
        return selectedSchools
            .map(school => {
                const data = getFinancialData(school.DistrictName);
                if (!data) return null;

                const total = data.instruction_spending + data.support_spending + data.transportation_spending;
                return [
                    { name: 'Instruction', value: (data.instruction_spending / total * 100) },
                    { name: 'Support Services', value: (data.support_spending / total * 100) },
                    { name: 'Transportation', value: (data.transportation_spending / total * 100) }
                ];
            })
            .filter((data): data is NonNullable<typeof data> => data !== null);
    };

    const formatAidRatioData = () => {
        return selectedSchools
            .map(school => {
                const data = getFinancialData(school.DistrictName);
                if (!data) return null;
                return {
                    name: school.Name,
                    'Market Value Aid Ratio': Number(data.market_value_aid_ratio * 100).toFixed(1)
                };
            })
            .filter((data): data is NonNullable<typeof data> => data !== null);
    };

    if (isLoading) {
        return <div className="loading">Loading financial data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="comparison-section">
            <div className="selected-schools">
                {selectedSchools.map((school) => (
                    <div key={school.id} className="school-item">
                        <span className="school-name">{school.Name}</span>
                        <button
                            className="remove-button"
                            onClick={() => onRemoveSchool(school.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {selectedSchools.length > 0 && financialData.length > 0 && (
                <div className="charts-section">
                    <div className="chart-container">
                        <h3 className="chart-title">Revenue Sources (in millions)</h3>
                        <div style={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart data={formatRevenueData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}M`} />
                                    <Legend />
                                    <Bar dataKey="Local Taxes" fill="#0088FE" />
                                    <Bar dataKey="State Revenue" fill="#00C49F" />
                                    <Bar dataKey="Federal Revenue" fill="#FFBB28" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3 className="chart-title">Expenditure Distribution</h3>
                        <div className="pie-charts-container">
                            {selectedSchools.map((school, index) => {
                                const data = formatExpenditureData()[index];
                                if (!data) return null;

                                return (
                                    <div key={school.id} className="pie-chart-wrapper">
                                        <h4>{school.Name}</h4>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={data}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {data.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3 className="chart-title">Market Value Aid Ratio</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={formatAidRatioData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip formatter={(value) => `${value}%`} />
                                    <Bar dataKey="Market Value Aid Ratio" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialAnalysisComparison;