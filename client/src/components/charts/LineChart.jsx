import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function LineChart({ chartData, ariaLabel }) {
  return <Line data={chartData} aria-label={ariaLabel} />;
}

export default LineChart;