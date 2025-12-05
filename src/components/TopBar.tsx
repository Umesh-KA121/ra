export default function TopBar() {
  return (
    <div className="w-full bg-white dark:bg-[#1d1f24] shadow px-6 py-3 flex gap-4 border-b border-gray-300 dark:border-gray-700">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
        Add Resource
      </button>

      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow">
        Add Process
      </button>
    </div>
  );
}
