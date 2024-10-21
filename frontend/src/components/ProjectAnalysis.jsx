import React, { useEffect, useState } from 'react';
import { fetchInterviews } from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  Title,
  Tooltip,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(BarElement, Title, Tooltip, CategoryScale, LinearScale);

const ProjectAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectTypes, setProjectTypes] = useState({});
  const [averageScores, setAverageScores] = useState({});

  const groupProjects = () => {
    if (projects.length > 0) {
      const grouped = projects.reduce((acc, project) => {
        const { project_id } = project;
        if (!acc[project_id]) {
          acc[project_id] = [];
        }
        acc[project_id].push(project);
        return acc;
      }, {});

      setProjectTypes(grouped);
      calculateAverageScores(grouped);
    }
  };

  const calculateAverageScores = (groupedProjects) => {
    const averages = {};

    Object.keys(groupedProjects).forEach((projectId) => {
      const projects = groupedProjects[projectId];
      const totalScore = projects.reduce((sum, project) => {
        const score = project.finished_interview_data?.[0]?.evaluation?.score || 0;
        return sum + score;
      }, 0);

      averages[projectId] = (totalScore / projects.length).toFixed(2);
    });

    setAverageScores(averages);
  };

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await fetchInterviews();
        setProjects(res.data.interviews_list);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  useEffect(() => {
    groupProjects();
  }, [projects]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data.</p>;

  const generateChartData = (interviews) => ({
    labels: interviews.map((_, index) => `Interview ${index + 1}`),
    datasets: [
      {
        label: 'Scores',
        data: interviews.map(
          (interview) => interview.finished_interview_data?.[0]?.evaluation?.score || 0
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Adjust color and transparency
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10, // Assuming the max score is 100
        ticks: {
          stepSize: 1, // Increment by 1 unit
        },
      },
      x: {
        ticks: {
          autoSkip: false, // Ensure all labels are shown
        },
      },
    },
  };

  return (
    <div className="rounded-lg p-6 shadow mb-6">
      <h2 className="text-2xl font-semibold">Project Analysis</h2>
      <div className="flex justify-center flex-wrap p-3">
        {Object.keys(projectTypes).map((key) => (
          <div key={key} className="p-6 rounded-lg shadow m-3 cursor-pointer w-80 h-80">
            <h3 className="text-lg font-medium">Project ID: {key}</h3>
            <p>Average Score: {averageScores[key]}</p>
            <Bar
              data={generateChartData(projectTypes[key])}
              options={chartOptions}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectAnalysis;
