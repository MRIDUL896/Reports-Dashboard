import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InterviewStats({ data }) {
  const totalInterviews = data.data.interviews_list.length;
  const completed = data.data.interviews_list.filter(i => i.status === "processed").length;
  const pending = totalInterviews - completed;

  // Chart data
  const chartData = {
    labels: ['Total Interviews', 'Completed', 'Pending'],
    datasets: [
      {
        label: 'Interviews',
        data: [totalInterviews, completed, pending],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Total Interviews
          'rgba(54, 162, 235, 0.6)', // Completed
          'rgba(255, 99, 132, 0.6)', // Pending
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
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
        text: 'Interview Statistics',
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Interview Stats</h2>
      <div className='w-80 h-64'>
        <Bar data={chartData} options={options} />
      </div>
      <div className="flex justify-between mt-6 gap-10">
        <p>Total Interviews: <span className="text-blue-400">{totalInterviews}</span></p>
        <p>Completed: <span className="text-blue-400">{completed}</span></p>
        <p>Pending: <span className="text-blue-400">{pending}</span></p>
      </div>
    </div>
  );
}
