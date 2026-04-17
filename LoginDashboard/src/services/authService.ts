import axiosInstance from "../api/axiosInstance";

export const loginUser = async (loginData: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstance.post("/auth/login", loginData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const logoutUser = async () => {
  try {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Logout failed" };
  }
};