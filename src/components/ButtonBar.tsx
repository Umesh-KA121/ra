const ButtonBar = () => {
  return (
    <div className="flex gap-3 bg-white shadow-sm p-3 rounded-xl">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm">
        Add Process
      </button>

      <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm">
        Add Resource
      </button>
    </div>
  );
};

export default ButtonBar;
