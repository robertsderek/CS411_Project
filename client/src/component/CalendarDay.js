import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CalendarDay({ day, calendarDayItem }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/AddContent', { state: {calendarDayItem, day} })
    }

    return (
        <div className='calendarDay' onClick={handleClick}>
            <div className='calendarDay-date'>
                {day}
            </div>

            <div className='calendarDay-weather'>
                {calendarDayItem.weather?.avgtemp_f !== undefined ? calendarDayItem.weather?.avgtemp_f + "°F" : undefined}
            </div>

            <div className='calendarDay-weather-condition'>
                {calendarDayItem.weather?.condition?.text}
            </div>

            <div className='weatherIcon'>
                <img src={calendarDayItem.weather?.condition?.icon !== undefined ? 'https:' + calendarDayItem.weather?.condition?.icon : undefined } alt=''/>
            </div>

            <div className='calendarDay-content'>
                <p>{calendarDayItem.content.name}</p>
                <p>{calendarDayItem.content.address}</p>
            </div>
        </div>
    )
};