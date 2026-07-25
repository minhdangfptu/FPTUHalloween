import axiosClient from "./axiosClient";

const unwrap = (response) => response?.data?.data ?? response?.data ?? [];

export const staffChatAPI = {
  getConversations: () => axiosClient.get("/staff-chat/conversations").then(unwrap),
  getGroups: () => axiosClient.get("/staff-chat/groups").then(unwrap),
  createGroup: (payload) => axiosClient.post("/staff-chat/groups", payload).then(unwrap),
  updateGroup: (groupId, payload) => axiosClient.patch(`/staff-chat/groups/${groupId}`, payload).then(unwrap),
  removeGroupMember: (groupId, userId) => axiosClient.delete(`/staff-chat/groups/${groupId}/members/${userId}`).then(unwrap),
  searchUsers: (q) => axiosClient.get("/staff-chat/users/search", { params: { q } }).then(unwrap),
  createDirectConversation: (userId) =>
    axiosClient.post(`/staff-chat/direct/${userId}`).then(unwrap),
  getMessages: (conversationId, params = {}) =>
    axiosClient.get(`/staff-chat/conversations/${conversationId}/messages`, { params }).then(unwrap),
};
