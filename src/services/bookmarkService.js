import httpRequest from "../utils/httpRequest";

export const remove = async (id) => {
  const result = await httpRequest.del("/bookmarks/all", id);
  return result;
};
export default {
  remove,
};
