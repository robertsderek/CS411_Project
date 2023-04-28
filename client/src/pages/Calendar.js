import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarDay from '../component/CalendarDay';

export default function Calendar({userEmail}) {
    const [data, setData] = useState([]);

    useEffect(() =>{
        const fetchData = async() =>{
            const result = await axios.get('http://localhost:3001/calendar?userEmail=james@gmail.com');
            setData(result.data);
        };
        fetchData();
    }, []);

    return (
        <div className='calendar'>
            {data.map(item =>(
                <CalendarDay date={item.formattedDate} weather={item.weather.avgtemp_f} content={item.content} />
            ))}
        </div>
      );
      
}