export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  // User Service
  async getUserProfile() {
    return this.fetchWithAuth('/users/profile');
  }

  // AI Service
  async generateClips(videoId: string) {
    return this.fetchWithAuth(`/ai/clip/${videoId}`, { method: 'POST' });
  }

  // Render Service
  async getRenderStatus(jobId: string) {
    return this.fetchWithAuth(`/renders/${jobId}`);
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

