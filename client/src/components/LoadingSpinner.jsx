const LoadingSpinner = ({
  text = "Loading...",
}) => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex items-center gap-3 text-slate-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

        <span className="text-sm">
          {text}
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;