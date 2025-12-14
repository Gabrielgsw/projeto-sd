import api from "./api";

export const getUserNotifications = async (userId) => {
  // Gateway /notifications -> notification-service /notifications/:userId
  const response = await api.get(`/notifications/notifications/${userId}`);
  return response.data;
};