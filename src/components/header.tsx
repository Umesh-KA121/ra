export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-[#1d1f24] shadow-md px-6 py-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Resource Allocation Graph Simulator
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Visualize and detect deadlocks using RAG & Banker’s Algorithm
      </p>
    </header>
  );
}
