import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

interface SchoolDemographics {
  School_Name: string;
  American_Indian_Alaskan_Native: number;
  Asian: number;
  Native_Hawaiian_or_other_Pacific_Islander: number;
  Black_African_American: number;
  Hispanic: number;
  White: number;
  Two_or_More_Races: number;
}

interface DemographicComparisonProps {
  demographicData: SchoolDemographics[];
}

const DemographicComparison: React.FC<DemographicComparisonProps> = ({ demographicData }) => {
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);

  const handleSchoolSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setSelectedSchools(selected);
    updateChartData(selected);
  };


  const updateChartData = (selected: string[]) => {
    const filteredSchools = demographicData.filter((school) => selected.includes(school.School_Name));
    const labels = ['American Indian', 'Asian', 'Native Hawaiian', 'Black', 'Hispanic', 'White', 'Two or More Races'];

    const datasets = filteredSchools.map((school) => ({
      label: school.School_Name,
      data: [
        school.American_Indian_Alaskan_Native,
        school.Asian,
        school.Native_Hawaiian_or_other_Pacific_Islander,
        school.Black_African_American,
        school.Hispanic,
        school.White,
        school.Two_or_More_Races,
      ],
      backgroundColor: getRandomColor(),
    }));

    setComparisonData({ labels, datasets });
  };

  const getRandomColor = () => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
      <div className="comparison-container">
        <h2>Compare School Demographics</h2>

        <label>Select Schools to Compare:</label>
        <select multiple onChange={handleSchoolSelection} className="school-select">
          {demographicData.map((school) => (
              <option key={school.School_Name} value={school.School_Name}>
                {school.School_Name}
              </option>
          ))}
        </select>

        {comparisonData && (
            <div className="chart">
              <Bar data={comparisonData} />
            </div>
        )}
      </div>
  );
};

export default DemographicComparison;
