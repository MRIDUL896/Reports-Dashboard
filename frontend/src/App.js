import { useEffect, useState } from "react";
import { fetchInterviews } from "./api";
import InterviewStats from "./components/InterviewStats";
import ProjectAnalysis from "./components/ProjectAnalysis";
import TemporalPerformance from "./components/TemporalPerformance";
import DimensionalBreakdown from "./components/DimensionalBreakdown";

function App() {
  const [data, setData] = useState(null);
  const [visibleComponent, setVisibleComponent] = useState(null);

  useEffect(() => {
    fetchInterviews().then((res) => {
      setData(res);
      console.log(res);
    });
  }, []);

  const toggleComponent = (component) => {
    setVisibleComponent((prev) => (prev === component ? null : component));
  };

  if (!data) return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-400">Interview Dashboard</h1>
      <div className="flex flex-wrap w-full p-6 m-2 gap-4">
        {/* Interview Stats */}
        <div className="flex-1 p-2">
          <div
            className="cursor-pointer p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
            onClick={() => toggleComponent("interviewStats")}
          >
            <h2 className="text-xl text-center font-semibold">Interview Stats</h2>
          </div>
        </div>

        {/* Dimensional Breakdown */}
        <div className="flex-1 p-2">
          <div
            className="cursor-pointer p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
            onClick={() => toggleComponent("dimensionalBreakdown")}
          >
            <h2 className="text-xl text-center font-semibold">Dimensional Breakdown</h2>
          </div>
        </div>

        {/* Temporal Performance */}
        <div className="flex-1 p-2">
          <div
            className="cursor-pointer p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
            onClick={() => toggleComponent("temporalPerformance")}
          >
            <h2 className="text-xl text-center font-semibold">Temporal Performance</h2>
          </div>
        </div>

        {/* Project Analysis */}
        <div className="flex-1 p-2">
          <div
            className="cursor-pointer p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
            onClick={() => toggleComponent("projectAnalysis")}
          >
            <h2 className="text-xl text-center font-semibold">Project Analysis</h2>
          </div>
        </div>
      </div>

      {visibleComponent && (
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg transition-all duration-300 mt-4 w-full">
          {visibleComponent === "interviewStats" && <InterviewStats data={data} />}
          {visibleComponent === "dimensionalBreakdown" && <DimensionalBreakdown data={data} />}
          {visibleComponent === "temporalPerformance" && <TemporalPerformance data={data} />}
          {visibleComponent === "projectAnalysis" && <ProjectAnalysis data={data} />}
        </div>
      )}
    </div>
  );
}

export default App;
