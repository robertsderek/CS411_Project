import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarDay from '../component/CalendarDay';
import "./calendar.css";

export default function Calendar({userEmail}) {
    const [data, setData] = useState([]);
    const [currentMonthYear, setCurrentMonthYear] = useState('')

    useEffect(() =>{
        const fetchData = async() =>{
            const result = await axios.get('http://localhost:3001/calendar?userEmail=james@gmail.com');
            setData(result.data);
        };
        fetchData();

        const now = new Date();
        const currentMonth = now.toLocaleString('default', {month: 'long'});
        const currentYear = now.getFullYear();
        setCurrentMonthYear(`${currentMonth} ${currentYear}`);
    }, []);


    return (
        <div className='calendarContainer'>
          <div className='calendarHeader'>{currentMonthYear}</div>

          <div className='calendar'>
            {data.map((item, index) => (
              <CalendarDay
                day={index + 1}
                date={item.formattedDate}
                weather={item.weather?.avgtemp_f !== undefined ? item.weather?.avgtemp_f + "°F" : undefined}
                weatherCondition={item.weather?.condition?.text}
                weatherIcon={item.weather?.condition?.icon !== undefined ? 'https:' + item.weather?.condition?.icon : undefined}
                placeName={item.content?.name}
                placeAddress={item.content?.address}
              />
            ))}
          </div>
        </div>
      );
}