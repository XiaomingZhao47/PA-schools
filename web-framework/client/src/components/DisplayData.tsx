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
import React, { useState } from 'react';
import { School } from '../types';


interface DisplayDataProps {
    schools: School[],
    refreshSchools: () => Promise<void>
}



const DisplayData: React.FC<DisplayDataProps> = ({ schools, refreshSchools }) => {
    const [schoolCount, setSchoolCount] = useState<number>(10);


    return (
        <div>
            <h2>School List</h2>
            <ul className="school-list">
                {schools.slice(0,schoolCount).map((school) => (
                    <li key={school.id}>
                        <strong>District:</strong> {school.DistrictName} <br/>
                        <strong>Name:</strong> {school.Name} <br/>
                        <strong>AUN:</strong> {school.AUN} <br/>
                        <strong>Schl:</strong> {school.Schl} <br/>
                        <strong>Data Element:</strong> {school.DataElement} <br/>
                        <strong>Display Value:</strong> {school.DisplayValue} <br/>

                        <button onClick={refreshSchools}>Refresh Schools</button> <br/><br/>
                    </li>
                ))}
            </ul>

            <button onClick={ () => setSchoolCount(schoolCount + 10) }>Load More Schools</button>
        </div>
    );
};

export default DisplayData;

