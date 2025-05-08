export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative flex">
        <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-400 animate-spin"></div>
      </div>
      <h2 className="mt-6 text-xl font-medium text-gray-400">Loading</h2>
      <p className="mt-2 text-gray-500">
        Please wait while we fetch your data...
      </p>
    </div>
  );
}
