// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
//
// interface School {
//     id: number;
//     school_name: string;
//     location: string;
// }
//
// interface DisplayDataProps {
//     schools: School[];
//     refreshSchools: () => void;
// }

// const DisplayData: React.FC<DisplayDataProps> = ({ schools, refreshSchools }) => {
//     const handleDelete = async (id: number) => {
//         try {
//             await axios.delete(`http://localhost:5001/api/data/${id}`);
//             refreshSchools();
//         } catch (error) {
//             console.error('Error deleting school:', error);
//         }
//     };
//
//     return (
//         <div>
//             <h2>School List</h2>
//             <ul>
//                 {schools.map((school) => (
//                     <li key={school.id}>
//                         {school.id}: {school.school_name} - Located in {school.location}
//                         <button onClick={() => handleDelete(school.id)}>Delete</button> {}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// ************************************************************
// * test for display new data from database
// ************************************************************
import React from 'react';
import { School } from '../types';

interface DisplayDataProps {
    schools: School[];
    refreshSchools: () => Promise<void>;
}

const DisplayData: React.FC<DisplayDataProps> = ({ schools, refreshSchools }) => {
    return (
        <div>
            <h2>School List</h2>
            <ul className="school-list">
                {schools.map((school) => (
                    <li key={school.id}>
                        <strong>District:</strong> {school.DistrictName} <br />
                        <strong>Name:</strong> {school.Name} <br />
                        <strong>AUN:</strong> {school.AUN} <br />
                        <strong>Schl:</strong> {school.Schl} <br />
                        <strong>Data Element:</strong> {school.DataElement} <br />
                        <strong>Display Value:</strong> {school.DisplayValue}

                        <button onClick={refreshSchools}>Refresh Schools</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DisplayData;

