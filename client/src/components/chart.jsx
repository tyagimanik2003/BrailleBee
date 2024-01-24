import React, { useState } from 'react';
import LineChart from './charts/LineChart.jsx'
import { UserData } from './Data';

const Chart = () => {
    const [userData, setUserData] = useState({
        labels: UserData.map((data) => data.year),
        datasets: [
          {
            label: "PDFs Processed - 2023",
            data: UserData.map((data) => data.userGain),
            backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });
    
  return (
    <div className='flex items-center ml-[2rem]'>
        <div style={{ width: 700 }} className='w-[50%]'>
        <LineChart chartData={userData} className="w-[90rem]"/>
      </div>
      
    </div>
  )
}

export default Chart