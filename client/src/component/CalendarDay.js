import React from 'react';

export default function CalendarDay({ date, weather, content}) {
    return (
        <div className='calendarDay'>
            <div className='calendarDay-date'>
                {date}
            </div>

            <div className='calendarDay-weater'>
                {weather}
            </div>

            <div className='calendarDay-content'>
                {content}
            </div>
        </div>
    )
};