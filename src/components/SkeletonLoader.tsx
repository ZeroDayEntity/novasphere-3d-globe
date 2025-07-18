
const SkeletonLoader = () => (
    <div className="animate-pulse flex flex-col space-y-4 pt-8">
      <div className="bg-gray-700/50 h-32 w-full rounded-lg"></div>
      <div className="h-8 bg-gray-700/50 rounded w-3/4"></div>
      <div className="border-t border-white/20 my-4"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-gray-700/50 rounded col-span-1"></div>
          <div className="h-4 bg-gray-700/50 rounded col-span-2"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-gray-700/50 rounded col-span-1"></div>
          <div className="h-4 bg-gray-700/50 rounded col-span-2"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-gray-700/50 rounded col-span-1"></div>
          <div className="h-4 bg-gray-700/50 rounded col-span-2"></div>
        </div>
        <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
      </div>
    </div>
  );
  
  export default SkeletonLoader;
