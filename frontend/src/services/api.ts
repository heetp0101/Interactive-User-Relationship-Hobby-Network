// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
}

export interface UserInput {
  username: string;
  age: number;
  hobbies: string[];
}

export interface GraphData {
  nodes: {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
    popularityScore: number;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
}

export const userApi = {
  getAllUsers: () => api.get<User[]>('/users'),
  createUser: (data: UserInput) => api.post<User>('/users', data),
  updateUser: (id: string, data: Partial<UserInput>) => api.put<User>(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  createFriendship: (userId: string, friendId: string) => 
    api.post(`/users/${userId}/link`, { friendId }),
  removeFriendship: (userId: string, friendId: string) => 
    api.delete(`/users/${userId}/unlink`, { data: { friendId } }),
  getGraphData: () => api.get<GraphData>('/graph'),
};

export default api;