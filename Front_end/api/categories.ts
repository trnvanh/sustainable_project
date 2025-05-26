import api from "@/api/axiosConfig";
import {CategoryResponse} from "@/types/categoryTypes";

export const fetchCategories = async () => {
    try {
        const response = await api.get<CategoryResponse>("/categories");
        return response.data;
    } catch (error: any) {
        // throw new Error(error.response?.data?.message || 'Loading failed');
    }
};
