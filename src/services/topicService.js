import httpRequest from "../utils/httpRequest";

export const getListTopic = async () => {
  const topics = await httpRequest.get("/topics");

  return topics;
};

export const getById = async (id) => {
  const topic = await httpRequest.get(`/topics/${id}`);
  return topic.data;
};
export const getBySlug = async (slug) => {
  const topic = await httpRequest.get(`/topics/slug/${slug}`);
  console.log(topic.data);

  return topic.data;
};

// export const create = async (data) => {
//   const topic = await httpRequest.topic("/topics", data);

//   return topic.data;
// };
// export const update = async (id, data) => {
//   const topic = await httpRequest.put(`/topics/${id}`, data);

//   return topic.data;
// };

// export const remove = async (id) => {
//   const topic = await httpRequest.remove(`/topics/${id}`);

//   return topic.data;
// };

export default {
  getListTopic,
  getById,
  getBySlug,
  // create,
  // update,
  // remove,
};
