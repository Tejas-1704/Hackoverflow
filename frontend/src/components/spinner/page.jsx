"use client"

const LoadingSpinner = () => {
  return (
    <div className="flex space-x-2 justify-center items-center h-8  dark:text-white">
      <span className="sr-only">Loading...</span>
      <div className="h-4 w-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
      <div className="h-4 w-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
      <div className="h-4 w-4 bg-white rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingSpinner;
