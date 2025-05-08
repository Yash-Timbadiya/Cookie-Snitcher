import { useState, FormEvent } from "react";

type FilterBarProps = {
  onFilter: (url: string) => void;
};

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilter(url.trim());
  };

  const clearFilter = () => {
    setUrl("");
    onFilter("");
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="url-filter"
            className="block text-gray-400 mb-1 text-sm"
          >
            Filter by URL
          </label>
          <input
            id="url-filter"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to filter..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filter
          </button>
          <button
            type="button"
            onClick={clearFilter}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
