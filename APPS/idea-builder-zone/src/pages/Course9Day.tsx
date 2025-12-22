import React, { useState } from 'react';

const days = Array.from({ length: 9 }, (_, i) => `Day ${i + 1}`);

const Course9Day: React.FC = () => {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">9-Day Course</h1>
      <div className="flex justify-center mb-6">
        {days.map((day, idx) => (
          <button
            key={day}
            className={`px-4 py-2 mx-1 rounded-t-md border-b-2 transition-colors duration-200 ${
              activeDay === idx
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-blue-100'
            }`}
            onClick={() => setActiveDay(idx)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded shadow text-center min-h-[120px]">
        <p className="text-lg">{`${days[activeDay]} content goes here`}</p>
      </div>
    </div>
  );
};

export default Course9Day;
