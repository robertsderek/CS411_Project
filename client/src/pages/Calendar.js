import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import CalendarDay from '../component/CalendarDay';
import "./calendar.css";

export default function Calendar() {
    const [data, setData] = useState([]);
    const [currentMonthYear, setCurrentMonthYear] = useState('')
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const userEmail = location.state.userEmail;
    const { latitude, longitude } = location.state.location;
    const formattedLocation = `${latitude},${longitude}`;

    useEffect(() =>{
        const fetchData = async() =>{
          axios.get(`http://localhost:3001/calendar?userEmail=${userEmail}&location=${formattedLocation}`)
          .then((response) => {
            setData(response.data);
            setIsLoading(false);
            console.log(response.data);
          })

        };
        fetchData();

        const now = new Date();
        const currentMonth = now.toLocaleString('default', {month: 'long'});
        const currentYear = now.getFullYear();
        setCurrentMonthYear(`${currentMonth} ${currentYear}`);
    }, [userEmail, formattedLocation]);


    return (
        <div className='calendarContainer'>
          <div className='calendarHeader'>{currentMonthYear}</div>

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className='calendar'>
              {data.map((item, index) => (
                <CalendarDay
                  day={index + 1}
                  calendarDayItem={item}
                />
              ))}
            </div>
          )}
        </div>
      );
}
