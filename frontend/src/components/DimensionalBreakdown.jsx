import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DimensionalBreakdown({ data }) {
  const dimensions = {};

  data.data.interviews_list
    .filter((i) => i.status === "processed")
    .forEach((interview) =>
      interview.finished_interview_data[0].evaluation.dimensional_scores.forEach(
        ({ dimension, score }) => {
          if (!dimensions[dimension]) dimensions[dimension] = [];
          dimensions[dimension].push(score);
        }
      )
    );

  const avgDimensions = Object.keys(dimensions).map((key) => ({
    dimension: key,
    average:
      dimensions[key].reduce((sum, score) => sum + score, 0) /
      dimensions[key].length,
  }));

  // Generate different bright colors
  const colors = [
    'rgba(255, 99, 132, 0.6)', // Bright Red
    'rgba(54, 162, 235, 0.6)', // Bright Blue
    'rgba(255, 206, 86, 0.6)', // Bright Yellow
    'rgba(75, 192, 192, 0.6)', // Bright Teal
    'rgba(153, 102, 255, 0.6)', // Bright Purple
    'rgba(255, 159, 64, 0.6)', // Bright Orange
    'rgba(255, 99, 132, 0.6)', // Repeating Bright Red
    'rgba(54, 162, 235, 0.6)', // Repeating Bright Blue
  ];

  // Chart data
  const chartData = {
    labels: avgDimensions.map(({ dimension }) => dimension),
    datasets: [
      {
        label: 'Average Scores',
        data: avgDimensions.map(({ average }) => average),
        backgroundColor: avgDimensions.map((_, index) => colors[index % colors.length]), // Cycle through colors
        borderColor: avgDimensions.map((_, index) => colors[index % colors.length].replace('0.6', '1')), // Change opacity for borders
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dimensional Breakdown',
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow mb-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Dimensional Breakdown</h2>
      <div className='w-full h-64'>
        <Bar data={chartData} options={options} />
      </div>
      <ul className="flex gap-10">
        {avgDimensions.map(({ dimension, average }) => (
          <li key={dimension} className="mb-2">
            {dimension}: <span className="text-blue-400">{average.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
