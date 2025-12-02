const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

export const api = {
  getLinks: async (page = 1, limit = 10, search = ''): Promise<LinksResponse> => {
    const res = await fetch(`${BASE_URL}/links?page=${page}&limit=${limit}&search=${search}`);
    if (!res.ok) throw new Error('Failed to fetch links');
    return res.json();
  },

  createLink: async (targetUrl: string, customCode?: string): Promise<Link> => {
    const res = await fetch(`${BASE_URL}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl, customCode }),
    });
    if (!res.ok) {
      if (res.status === 409) throw new Error('Short code already exists');
      throw new Error('Failed to create link');
    }
    return res.json();
  },

  deleteLink: async (code: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/links/${code}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete link');
  },

  getLinkStats: async (code: string): Promise<Link> => {
    const res = await fetch(`${BASE_URL}/links/${code}`);
    if (!res.ok) throw new Error('Failed to fetch link stats');
    return res.json();
  },
};
