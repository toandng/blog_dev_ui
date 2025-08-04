import httpRequest from "../utils/httpRequest";

export const getAllByPostId = async (id) => {
  const result = await httpRequest.get(`/comments/post/${id}`);
  return result;
};

export const create = async (data) => {
  const response = await httpRequest.post(`/comments`, data);
  return response.data;
};

export const update = async (data, id) => {
  const result = await httpRequest.put(`/comments/${id}`, data);
  return result;
};

export const toggleLike = async (commentId) => {
  const result = await httpRequest.post(`/comments/${commentId}/like`);
  return result;
};

export default {
  getAllByPostId,
  create,
  update,
  toggleLike,
};
