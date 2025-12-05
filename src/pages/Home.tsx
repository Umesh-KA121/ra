import Header from "../components/header";
import ButtonBar from "../components/ButtonBar";
import Graph from "../components/GraphPanel";
import Controls from "../components/ControlPanel";
import AllocationMatrix from "../components/AllocationMatrix";
import RequestMatrix from "../components/RequestMatrix";

const Home = () => {
  return (
    <div className="w-full min-h-screen p-6 flex flex-col gap-4 bg-gray-100">

      {/* HEADER */}
      <Header />

      {/* BUTTON BAR */}
      <ButtonBar />

      {/* MAIN LAYOUT */}
      <div className="flex w-full gap-4 mt-2">

        {/* LEFT GRAPH AREA (flex-grow) */}
        <div className="flex flex-col flex-grow bg-white rounded-xl shadow p-4 min-h-[500px]">
          <Graph />
        </div>

        {/* FIXED RIGHT PANEL */}
        <div className="flex flex-col gap-4 w-[320px]">

          <Controls />

          <AllocationMatrix />

          <RequestMatrix />

        </div>
      </div>
    </div>
  );
};

export default Home;
