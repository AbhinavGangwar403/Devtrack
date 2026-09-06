import api from "./api";

export const addMember = async (
  projectId,
  memberData
) => {
  const response = await api.post(
    `/projects/${projectId}/members`,
    memberData
  );

  return response.data;
};

export const removeMember = async (
  projectId,
  userId
) => {
  const response = await api.delete(
    `/projects/${projectId}/members/${userId}`
  );

  return response.data;
};

export const updateMemberRole = async (
  projectId,
  userId,
  role
) => {
  const response = await api.patch(
    `/projects/${projectId}/members/${userId}`,
    { role }
  );

  return response.data;
};