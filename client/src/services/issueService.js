import api from "./api";

export const getIssues = async (projectId, params = {}) => {
  const response = await api.get(
    `/projects/${projectId}/issues`,
    { params }
  );

  return response.data;
};

export const getIssue = async (projectId, issueId) => {
  const response = await api.get(
    `/projects/${projectId}/issues/${issueId}`
  );

  return response.data;
};

export const createIssue = async (projectId, issueData) => {
  const response = await api.post(
    `/projects/${projectId}/issues`,
    issueData
  );

  return response.data;
};

export const updateIssue = async (
  projectId,
  issueId,
  issueData
) => {
  const response = await api.put(
    `/projects/${projectId}/issues/${issueId}`,
    issueData
  );

  return response.data;
};

export const deleteIssue = async (projectId, issueId) => {
  const response = await api.delete(
    `/projects/${projectId}/issues/${issueId}`
  );

  return response.data;
};

export const assignIssue = async (
  projectId,
  issueId,
  assignee
) => {
  const response = await api.patch(
    `/projects/${projectId}/issues/${issueId}/assign`,
    { assignee }
  );

  return response.data;
};