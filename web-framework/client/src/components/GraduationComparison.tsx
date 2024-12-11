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
    ResponsiveContainer
} from 'recharts';

interface Props {
    selectedSchools: GraduationData[];
    onRemoveSchool: (school: GraduationData) => void;
}

const GraduationComparison: React.FC<Props> = ({ selectedSchools, onRemoveSchool }) => {
    const formatData = (schools: GraduationData[]) => {
        return schools.map(school => ({
            name: school.district_name,
            '4 Year Rate': ((school.four_year_grads / school.four_year_cohort) * 100).toFixed(1),
            '5 Year Rate': ((school.five_year_grads / school.five_year_cohort) * 100).toFixed(1),
            '6 Year Rate': ((school.six_year_grads / school.six_year_cohort) * 100).toFixed(1),
        }));
    };

    return (
        <div className="comparison-container p-4">
            <div className="selected-schools mb-4">
                {selectedSchools.map((school) => (
                    <div key={school.district_name} className="school-card p-4 mb-4 border rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{school.district_name}</h3>
                            <button
                                onClick={() => onRemoveSchool(school)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold">Demographics</h4>
                                <p>White: {school.four_year_white_rate}%</p>
                                <p>Black: {school.four_year_black_rate}%</p>
                                <p>Hispanic: {school.four_year_hispanic_rate}%</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Economic Status</h4>
                                <p>Disadvantaged: {school.four_year_econ_disadvantaged_rate}%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedSchools.length > 0 && (
                <div className="graduation-chart h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formatData(selectedSchools)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="4 Year Rate" fill="#8884d8" />
                            <Bar dataKey="5 Year Rate" fill="#82ca9d" />
                            <Bar dataKey="6 Year Rate" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default GraduationComparison;