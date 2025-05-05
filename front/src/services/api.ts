// API service to handle all API requests

const API_URL = 'http://localhost:3001/api'; // Change to your NestJS server URL

// Create a function to handle API requests with authorization
const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      // If response is 401 Unauthorized, handle token expiration
      if (response.status === 401) {
        // Clear the token and potentially redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    // Check if the response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {};
    
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Projects API
export const projectsApi = {
  getAll: () => apiRequest('/projects'),
  getById: (id: string) => apiRequest(`/projects/${id}`),
  create: (projectData: any) => apiRequest('/projects', 'POST', projectData),
  update: (id: string, projectData: any) => apiRequest(`/projects/${id}`, 'PUT', projectData),
  delete: (id: string) => apiRequest(`/projects/${id}`, 'DELETE'),
  toggleFavorite: (id: string) => apiRequest(`/projects/${id}/favorite`, 'PUT'),
  toggleArchive: (id: string) => apiRequest(`/projects/${id}/archive`, 'PUT'),
};

// Add more API endpoints as needed