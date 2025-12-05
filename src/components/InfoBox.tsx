export default function InfoBox({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-[#1d1f24] rounded-xl shadow-xl h-[150px] p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        {title}
      </h2>
    </div>
  );
}
