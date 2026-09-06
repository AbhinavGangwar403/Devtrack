import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createProject,
  getProjects,
} from "../services/projectService";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(data.projects || data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await createProject(formData);

      setFormData({
        name: "",
        description: "",
      });

      setShowForm(false);

      await fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create project."
      );
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Projects
            </h1>

            <p className="mt-1 text-slate-400">
              Manage your development projects.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ New Project"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Create Project
            </h2>

            <form
              onSubmit={handleCreateProject}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Project name
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. DevTrack"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this project about?"
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700"
              >
                Create Project
              </button>
            </form>
          </div>
        )}

        {/* Projects */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">
              No projects yet
            </h2>

            <p className="mt-2 text-slate-400">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="group rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600/10 text-blue-500">
                    {project.name?.charAt(0).toUpperCase()}
                  </div>

                  <span className="text-sm text-slate-500">
                    {project.members?.length || 0} members
                  </span>
                </div>

                <h2 className="text-xl font-semibold group-hover:text-blue-400">
                  {project.name}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                  {project.description ||
                    "No description provided."}
                </p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Projects;