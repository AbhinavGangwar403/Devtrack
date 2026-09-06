import api from "./api";

export const getComments = async (
  projectId,
  issueId
) => {
  const response = await api.get(
    `/projects/${projectId}/issues/${issueId}/comments`
  );

  return response.data;
};

export const addComment = async (
  projectId,
  issueId,
  content
) => {
  const response = await api.post(
    `/projects/${projectId}/issues/${issueId}/comments`,
    { content }
  );

  return response.data;
};