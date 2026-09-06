import api from "./api";

export const getProjectActivities = async (
  projectId
) => {
  const response = await api.get(
    `/projects/${projectId}/activities`
  );

  return response.data;
};

export const getIssueActivities = async (
  projectId,
  issueId
) => {
  const response = await api.get(
    `/projects/${projectId}/issues/${issueId}/activities`
  );

  return response.data;
};