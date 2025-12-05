import Header from "./components/header";
import TopBar from "./components/TopBar";
import GraphPanel from "./components/GraphPanel";
import ControlPanel from "./components/ControlPanel";
import InfoBox from "./components/InfoBox";
import MatrixBox from "./components/MatrixBox";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="w-full h-screen bg-[#eef0f4] dark:bg-[#0e0f11] flex flex-col overflow-hidden relative">

      <ThemeToggle />

      <Header />
      <TopBar />

      {/* Middle layout */}
      <div className="flex flex-1 w-full px-4 py-4 gap-4 overflow-hidden">

        {/* LEFT: Graph */}
        <div className="flex-1">
          <GraphPanel />
        </div>

        {/* RIGHT: Controls & boxes */}
        <div className="w-[300px] flex flex-col gap-4">
          <ControlPanel />
          <InfoBox title="Mapping" />
          <InfoBox title="Summary" />
        </div>
      </div>

      {/* Bottom boxes */}
      <div className="w-full px-4 pb-4 flex gap-4">
        <MatrixBox title="Allocation Matrix" />
        <MatrixBox title="Request Matrix" />
      </div>
    </div>
  );
}
