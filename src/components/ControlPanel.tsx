export default function ControlPanel() {
  return (
    <div className="bg-white dark:bg-[#1d1f24] rounded-xl shadow-xl p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        Controls
      </h2>

      <div className="flex flex-col gap-3">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow">
          Detect Deadlock
        </button>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
          Run Banker’s Algorithm
        </button>

        <button className="w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow">
          Reset Graph
        </button>
      </div>
    </div>
  );
}
