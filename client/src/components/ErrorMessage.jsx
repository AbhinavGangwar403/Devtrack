const ErrorMessage = ({
  message,
  onRetry,
}) => {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-red-400">
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md border border-red-800 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-950"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;