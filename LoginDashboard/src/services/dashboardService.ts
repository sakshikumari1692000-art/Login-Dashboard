import axiosInstance from "../api/axiosInstance";

export const getDashboardData = async () => {
    try {
        const res = await axiosInstance.get("/dashboard");
        return res.data;
    } catch (error: any) {
        throw error.response?.data || { message: "Failed to load dashboard" };
    }
};
