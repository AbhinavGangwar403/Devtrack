import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="text-center">
        <p className="text-7xl font-bold text-blue-500">
          404
        </p>

        <h1 className="mt-4 text-2xl font-semibold text-white">
          Page not found
        </h1>

        <p className="mt-2 text-slate-500">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;