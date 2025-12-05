export default function MatrixBox({ title }: { title: string }) {
  return (
    <div className="flex-1 bg-white dark:bg-[#1d1f24] rounded-xl shadow-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {title}
      </h2>

      <div className="bg-[#f7f8fa] dark:bg-[#2a2d33] h-[180px] rounded-lg border border-gray-300 dark:border-gray-700"></div>
    </div>
  );
}
