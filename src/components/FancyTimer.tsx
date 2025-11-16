import React, { useEffect, useState } from "react";

type FancyTimerProps = {
  timeRemaining: number;
  totalTime: number;
};

const FancyTimer: React.FC<FancyTimerProps> = ({ timeRemaining, totalTime }) => {
  const percentage = (timeRemaining / totalTime) * 100
  const isUrgent = timeRemaining <= 3;
  const circumference = 2 * Math.PI * 54; // radius = 54
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Circular Timer */}
      <div className="relative">
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${
            isUrgent ? "bg-red-500/20" : "bg-emerald-500/20"
          }`}
        />

        {/* SVG Circle */}
        <svg className="relative transform -rotate-90" width="140" height="140">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-neutral-800"
          />

          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${
              isUrgent ? "text-red-500" : "text-emerald-500"
            }`}
          />
        </svg>

        {/* Time display in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className={`text-5xl font-bold tabular-nums transition-colors duration-300 ${
                isUrgent ? "text-red-500 animate-pulse" : "text-neutral-50"
              }`}
            >
              {timeRemaining}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FancyTimer;