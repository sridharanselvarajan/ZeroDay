import React from 'react';
import './TimetableGrid.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TimetableGrid = ({ entries }) => {
  return (
    <div className="timetable-container">
      <table className="timetable">
        <thead>
          <tr>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
            <th>Subject</th>
            <th>Location</th>
            <th>Faculty</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, rowIndex) => (
            entries.filter(e => e.dayOfWeek === day).length === 0 ? (
              <tr key={day} style={{ '--row-index': rowIndex }}><td className="no-classes-cell" colSpan={6}>{day}: No classes</td></tr>
            ) : (
              entries.filter(e => e.dayOfWeek === day).map((e, i) => (
                <tr key={e._id} style={{ '--row-index': rowIndex + i }}>
                  <td>{e.dayOfWeek}</td>
                  <td>{e.startTime}</td>
                  <td>{e.endTime}</td>
                  <td>{e.subject}</td>
                  <td>{e.location}</td>
                  <td>{e.faculty}</td>
                </tr>
              ))
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableGrid;
