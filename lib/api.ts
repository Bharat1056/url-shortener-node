import axiosInstance from './axios';

export interface Click {
  id: number;
  linkId: number;
  createdAt: string;
}

export interface UptimeCheck {
  id: number;
  linkId: number;
  status: 'UP' | 'DOWN';
  createdAt: string;
}

export interface Link {
  id: number;
  shortCode: string;
  targetUrl: string;
  totalClicks: number;
  lastClicked: string | null;
  createdAt: string;
  clicks?: Click[];
  uptimeChecks?: UptimeCheck[];
  dailyUptime?: {
    date: string;
    uptimePercentage: number;
    totalChecks: number;
  }[];
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

export interface SystemStats {
  ok: boolean;
  uptime: {
    seconds: number;
    formatted: string;
    startTime: string;
  };
  database: {
    connected: boolean;
    responseTime: string;
  };
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

  getSystemStats: async (): Promise<SystemStats> => {
    // Accessing healthz endpoint which is outside /api
    const baseURL = axiosInstance.defaults.baseURL || '';
    const rootURL = baseURL.replace(/\/api$/, '');
    const response = await axiosInstance.get<SystemStats>(`${rootURL}/healthz`);
    return response as unknown as SystemStats;
  },
};

