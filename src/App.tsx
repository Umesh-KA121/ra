import Header from "./components/header";
import ButtonPanel from "./components/buttonPanel";
import RightPanel from "./components/rightpanel";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <Header />

      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1 bg-gray-100 p-4 rounded-2xl shadow">
          <ButtonPanel />
        </div>

        <div className="w-1/3 bg-gray-200 p-4 rounded-2xl shadow">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
