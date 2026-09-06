import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import IssueDetails from "./pages/IssueDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

const ProtectedPage = ({ children }) => (
  <ProtectedRoute>
    <AppLayout>
      {children}
    </AppLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedPage>
              <Projects />
            </ProtectedPage>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedPage>
              <ProjectDetails />
            </ProtectedPage>
          }
        />

        <Route
          path="/projects/:projectId/issues/:issueId"
          element={
            <ProtectedPage>
              <IssueDetails />
            </ProtectedPage>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;