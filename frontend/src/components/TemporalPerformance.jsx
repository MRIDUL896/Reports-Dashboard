import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LineElement,
  Title,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  TimeScale,
  LineElement,
  Title,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function TemporalPerformance({ data }) {
  // Array of bright colors
  const brightColors = [
    'rgba(255, 99, 132, 1)', // Bright Red
    'rgba(54, 162, 235, 1)', // Bright Blue
    'rgba(255, 206, 86, 1)', // Bright Yellow
    'rgba(75, 192, 192, 1)', // Bright Teal
    'rgba(153, 102, 255, 1)', // Bright Purple
    'rgba(255, 159, 64, 1)', // Bright Orange
    'rgba(255, 99, 132, 1)', // Repeating Bright Red
  ];

  // Check if interviews_list is present and contains processed interviews
  const interviews = data.data.interviews_list || [];
  const processedInterviews = interviews.filter((i) => i.status === "processed");

  if (processedInterviews.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Temporal Performance</h2>
        <p>No processed interviews available for display.</p>
      </div>
    );
  }

  // Prepare scores over time
  const scoresOverTime = processedInterviews.map((interview) => ({
    x: new Date(interview.interview_start_at * 1000),
    y: interview.finished_interview_data?.[0]?.evaluation?.score || 0, // Handle potential undefined values
  }));

  // Prepare dimensional scores safely
  const dimensionalScores = processedInterviews[0]?.finished_interview_data?.[0]?.evaluation?.dimensional_scores || [];

  const dimensionCharts = dimensionalScores.map((dimension, index) => {
    // Create data for each dimension
    const dimensionData = processedInterviews.map((interview) => ({
      x: new Date(interview.interview_start_at * 1000),
      y: interview.finished_interview_data?.[0]?.evaluation?.dimensional_scores?.find(ds => ds.dimension === dimension.dimension)?.score || 0, // Handle potential undefined values
    }));

    return {
      label: dimension.dimension,
      data: dimensionData,
      borderColor: brightColors[index % brightColors.length], // Use bright colors for each dimension
      fill: false,
      pointRadius: 5,
    };
  });

  const overallChartData = {
    datasets: [
      {
        label: "Overall Score",
        data: scoresOverTime,
        borderColor: "rgb(75, 192, 192)", // You can also use a bright color here
        fill: false,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow for custom sizing
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 rounded-lg shadow mb-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Temporal Performance</h2>
      <div className="flex flex-wrap justify-center m-2">
        <div className="w-80 h-60 mb-4">
          <h3 className="text-lg font-medium mb-2">Overall Score</h3>
          <Line key={JSON.stringify(data)} data={overallChartData} options={options} />
        </div>
        {dimensionCharts.map((dataset, index) => (
          <div key={index} className="w-80 h-60 m-4">
            <h3 className="text-lg font-medium m-2">{dataset.label}</h3>
            <Line data={{ datasets: [dataset] }} options={options} />
          </div>
        ))}
      </div>
    </div>
  );
}
