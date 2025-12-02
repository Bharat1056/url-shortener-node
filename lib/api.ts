import axiosInstance from './axios';

export interface Link {
  id: number;
  shortCode: string;
  targetUrl: string;
  totalClicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LinksResponse {
  data: Link[];
  pagination: Pagination;
}

// Define the structure of our standardized API response
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export const api = {
  getLinks: async (page = 1, limit = 10, search = ''): Promise<LinksResponse> => {
    const response = await axiosInstance.get<ApiResponse<LinksResponse>>(`/links`, {
      params: { page, limit, search },
    });
    return (response as unknown as ApiResponse<LinksResponse>).data;
  },

  createLink: async (targetUrl: string, customCode?: string): Promise<Link> => {
    const response = await axiosInstance.post<ApiResponse<Link>>('/links', {
      targetUrl,
      customCode,
    });
    return (response as unknown as ApiResponse<Link>).data;
  },

  deleteLink: async (code: string): Promise<void> => {
    await axiosInstance.delete(`/links/${code}`);
  },

  getLinkStats: async (code: string): Promise<Link> => {
    const response = await axiosInstance.get<ApiResponse<Link>>(`/links/${code}`);
    return (response as unknown as ApiResponse<Link>).data;
  },
};

