import React, { useEffect, useRef, useState } from "react";

type FancyTimerProps = {
  timeRemaining: number;
  totalTime: number;
};

const FancyTimer: React.FC<FancyTimerProps> = ({ timeRemaining, totalTime }) => {
  // Prevent divide-by-zero or negative values
  const safeTimeRemaining = Math.max(0, timeRemaining || 0);
  const safeTotalTime = Math.max(1, totalTime || 1);

  // +1 for visual padding
  const displayTime = Math.max(0, safeTimeRemaining);

  // Use displayTime for circle fill as well
  const displayPercentage = (displayTime / (safeTotalTime)) * 100;

  const circumference = 2 * Math.PI * 54;

  // Animate the circle smoothly
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const newOffset = circumference - (displayPercentage / 100) * circumference;
    setDashOffset(newOffset);
  }, [displayPercentage, circumference]);

  const isUrgent = safeTimeRemaining <= 3;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${isUrgent ? "bg-red-500/20" : "bg-emerald-500/20"
            }`}
        />

        <svg className="relative transform -rotate-90" width="140" height="140">
          <circle
            cx="70"
            cy="70"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-neutral-800"
          />
          <circle
            cx="70"
            cy="70"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${isUrgent ? "text-red-500" : "text-emerald-500"
              }`}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className={`text-5xl font-bold tabular-nums transition-colors duration-300 ${isUrgent ? "text-red-500 animate-pulse" : "text-neutral-50"
                }`}
            >
              {displayTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyTimer;
