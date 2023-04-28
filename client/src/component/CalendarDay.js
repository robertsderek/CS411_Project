import React from 'react';

export default function CalendarDay({ day, weather, weatherCondition, weatherIcon, content}) {
    return (
        <div className='calendarDay'>
            <div className='calendarDay-date'>
                {day}
            </div>

            <div className='calendarDay-weather'>
                {weather}
            </div>

            <div className='calendarDay-weather-condition'>
                {weatherCondition}
            </div>

            <div className='weatherIcon'>
                <img src={weatherIcon} alt=''/>
            </div>

            <div className='calendarDay-content'>
                {content}
            </div>
        </div>
    )
};