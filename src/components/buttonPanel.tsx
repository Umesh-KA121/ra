export default function buttonPanel() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <button
          key={index}
          className="p-3 bg-white rounded-xl shadow hover:bg-gray-50"
        >
          Button {index + 1}
        </button>
      ))}
    </div>
  );
}
