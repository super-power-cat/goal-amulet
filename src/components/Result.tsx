import React from "react";
import { useLocation } from 'react-router-dom';

interface Answer {
  text: string;
}

interface Response {
  id: string | number;
  text: string;
  answers: Answer[];
}

const Result = () => {
  const location = useLocation();
  const responses = location.state?.responses || [];

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">회고 완료!</h3>
      <div className="space-y-6">
        {responses.map((answer, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
            <ul className="ml-4 space-y-1">
              <li className="text-gray-600">• {answer.text}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;
