"use client";

import React from "react";

export const DiscoverVisual = () => (
  <svg
    className="w-full h-full opacity-40"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Discover Step Visualization</title>

    {/* Background decorative circles */}
    <circle
      cx="100"
      cy="100"
      r="90"
      stroke="currentColor"
      strokeWidth="0.3"
      strokeDasharray="3 3"
      className="text-zinc-800 discover-bg-circle"
    />
    <circle
      cx="100"
      cy="100"
      r="75"
      stroke="currentColor"
      strokeWidth="0.3"
      className="text-zinc-700 discover-bg-circle"
    />
    <circle
      cx="100"
      cy="100"
      r="60"
      stroke="currentColor"
      strokeWidth="0.2"
      strokeDasharray="2 4"
      className="text-zinc-600 discover-bg-circle"
    />

    {/* Central analysis chart - scaled down from analysis.svg */}
    <g className="discover-chart">
      {/* Chart container */}
      <rect
        x="55"
        y="50"
        width="90"
        height="80"
        rx="4"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-zinc-600"
        fill="none"
      />

      {/* Chart bars - representing data analysis */}
      <rect
        x="65"
        y="110"
        width="8"
        height="12"
        className="text-zinc-500 discover-bar"
        fill="currentColor"
      />
      <rect
        x="78"
        y="95"
        width="8"
        height="27"
        className="text-zinc-500 discover-bar"
        fill="currentColor"
      />
      <rect
        x="91"
        y="75"
        width="8"
        height="47"
        className="text-zinc-400 discover-bar"
        fill="currentColor"
      />
      <rect
        x="104"
        y="85"
        width="8"
        height="37"
        className="text-zinc-500 discover-bar"
        fill="currentColor"
      />
      <rect
        x="117"
        y="65"
        width="8"
        height="57"
        className="text-zinc-300 discover-bar"
        fill="currentColor"
      />
      <rect
        x="130"
        y="100"
        width="8"
        height="22"
        className="text-zinc-500 discover-bar"
        fill="currentColor"
      />

      {/* Chart grid lines */}
      <line
        x1="65"
        y1="90"
        x2="138"
        y2="90"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeDasharray="2 2"
        className="text-zinc-700"
      />
      <line
        x1="65"
        y1="70"
        x2="138"
        y2="70"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeDasharray="2 2"
        className="text-zinc-700"
      />
    </g>

    {/* Data points / nodes around chart */}
    <circle
      cx="40"
      cy="60"
      r="3"
      fill="currentColor"
      className="text-zinc-400 discover-node"
    />
    <circle
      cx="160"
      cy="50"
      r="2"
      fill="currentColor"
      className="text-zinc-500 discover-node"
    />
    <circle
      cx="170"
      cy="120"
      r="2.5"
      fill="currentColor"
      className="text-zinc-400 discover-node"
    />
    <circle
      cx="35"
      cy="140"
      r="2"
      fill="currentColor"
      className="text-zinc-500 discover-node"
    />

    {/* Connection lines */}
    <path
      d="M55 90L40 60"
      stroke="currentColor"
      strokeWidth="0.3"
      className="text-zinc-600 discover-line"
    />
    <path
      d="M145 50L160 50"
      stroke="currentColor"
      strokeWidth="0.3"
      className="text-zinc-600 discover-line"
    />
    <path
      d="M145 110L170 120"
      stroke="currentColor"
      strokeWidth="0.3"
      className="text-zinc-600 discover-line"
    />
    <path
      d="M55 130L35 140"
      stroke="currentColor"
      strokeWidth="0.3"
      className="text-zinc-600 discover-line"
    />

    {/* Scanner bar for animation */}
    <line
      x1="55"
      y1="50"
      x2="145"
      y2="50"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-zinc-400 discover-scanner"
    />

    {/* Decorative data lines */}
    <path
      d="M20 160 Q60 140 100 150 T180 135"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      className="text-zinc-500 discover-wave"
    />
    <path
      d="M25 170 Q65 150 105 160 T175 145"
      stroke="currentColor"
      strokeWidth="0.3"
      fill="none"
      className="text-zinc-600 discover-wave"
    />

    {/* Labels */}
    <text
      x="15"
      y="25"
      className="fill-zinc-500 font-jetbrains-mono text-[4px] uppercase tracking-widest"
    >
      Data.Analysis
    </text>
    <text
      x="130"
      y="185"
      className="fill-zinc-600 font-jetbrains-mono text-[3px] uppercase"
    >
      Processing_Insights...
    </text>
  </svg>
);

export const BuildVisual = () => (
  <svg
    className="w-full h-full opacity-40"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Build Step Visualization</title>
    <rect
      x="70"
      y="70"
      width="60"
      height="60"
      rx="4"
      stroke="currentColor"
      strokeWidth="0.5"
      className="text-zinc-700"
    />
    <path
      d="M40 100H70M130 100H160M100 40V70M100 130V160"
      stroke="currentColor"
      strokeWidth="0.5"
      className="text-zinc-800"
    />

    {/* Logic Symbols */}
    <text
      x="75"
      y="90"
      className="fill-zinc-500 font-jetbrains-mono text-[8px] opacity-20"
    >
      {"{ }"}
    </text>
    <text
      x="95"
      y="110"
      className="fill-zinc-400 font-jetbrains-mono text-[8px]"
    >
      &lt;/&gt;
    </text>

    {/* Pulse Lines */}
    <path
      d="M40 100C60 100 80 80 100 100S140 120 160 100"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 4"
      className="text-zinc-500 build-flow"
    />

    <text
      x="10"
      y="20"
      className="fill-zinc-600 font-jetbrains-mono text-[5px] uppercase tracking-widest"
    >
      Dev.Assembly_Active
    </text>
    <text
      x="10"
      y="190"
      className="fill-zinc-700 font-jetbrains-mono text-[4px]"
    >
      COMPILE_STATUS: OK
    </text>
  </svg>
);

export const LaunchVisual = () => (
  <svg
    className="w-full h-full opacity-40"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Launch Step Visualization</title>
    <path
      d="M20 160Q100 160 180 40"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeDasharray="4 4"
      className="text-zinc-800"
    />
    <path
      d="M20 160Q100 160 180 40"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-zinc-400 launch-path"
    />

    {/* Waves */}
    <circle
      cx="180"
      cy="40"
      r="10"
      stroke="currentColor"
      strokeWidth="0.5"
      className="text-zinc-700 launch-wave"
    />
    <circle
      cx="180"
      cy="40"
      r="20"
      stroke="currentColor"
      strokeWidth="0.5"
      className="text-zinc-700 launch-wave"
    />
    <circle
      cx="180"
      cy="40"
      r="30"
      stroke="currentColor"
      strokeWidth="0.5"
      className="text-zinc-700 launch-wave"
    />

    <circle
      cx="180"
      cy="40"
      r="3"
      fill="currentColor"
      className="text-zinc-300"
    />

    <text
      x="10"
      y="20"
      className="fill-zinc-600 font-jetbrains-mono text-[5px] uppercase tracking-widest"
    >
      Deploy.Signal_Ready
    </text>
    <text
      x="145"
      y="30"
      className="fill-zinc-500 font-jetbrains-mono text-[4px]"
    >
      LIVE_NODE_01
    </text>
  </svg>
);
