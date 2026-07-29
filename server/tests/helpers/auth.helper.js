import { apiRequest } from "./request.helper.js";

export const registerUser = async (payload) => {
  return apiRequest.post("/api/auth/register").send(payload);
};

export const loginUser = async (email, password) => {
  return apiRequest.post("/api/auth/login").send({ email, password });
};

export const getAuthToken = async (payload) => {
  const response = await loginUser(payload.email, payload.password);

  if (!response.body?.data?.token) {
    throw new Error("Unable to obtain auth token from login response");
  }

  return response.body.data.token;
};
