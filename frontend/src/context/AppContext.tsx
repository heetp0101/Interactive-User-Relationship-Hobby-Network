// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { userApi, type User, type GraphData } from '../services/api';
import toast from 'react-hot-toast';

interface AppContextType {
  users: User[];
  graphData: GraphData;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  fetchGraphData: () => Promise<void>;
  createUser: (data: { username: string; age: number; hobbies: string[] }) => Promise<void>;
  updateUser: (id: string, data: Partial<{ username: string; age: number; hobbies: string[] }>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  createFriendship: (userId: string, friendId: string) => Promise<void>;
  removeFriendship: (userId: string, friendId: string) => Promise<void>;
  addHobbyToUser: (userId: string, hobby: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers();
      setUsers(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGraphData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getGraphData();
      setGraphData(response.data);
    } catch (error: any) {
      console.error('Failed to fetch graph data:', error);
      toast.error('Failed to connect to server. Is the backend running?');
      setGraphData({ nodes: [], edges: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: { username: string; age: number; hobbies: string[] }) => {
    try {
      setLoading(true);
      await userApi.createUser(data);
      toast.success('User created successfully!');
      await fetchGraphData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create user');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchGraphData]);

  const updateUser = useCallback(async (id: string, data: Partial<{ username: string; age: number; hobbies: string[] }>) => {
    try {
      setLoading(true);
      await userApi.updateUser(id, data);
      toast.success('User updated successfully!');
      await fetchGraphData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchGraphData]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await userApi.deleteUser(id);
      toast.success('User deleted successfully!');
      await fetchGraphData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchGraphData]);

  const createFriendship = useCallback(async (userId: string, friendId: string) => {
    try {
      setLoading(true);
      await userApi.createFriendship(userId, friendId);
      toast.success('Friendship created!');
      await fetchGraphData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create friendship');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchGraphData]);

  const removeFriendship = useCallback(async (userId: string, friendId: string) => {
    try {
      setLoading(true);
      await userApi.removeFriendship(userId, friendId);
      toast.success('Friendship removed!');
      await fetchGraphData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to remove friendship');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchGraphData]);

  const addHobbyToUser = useCallback(async (userId: string, hobby: string) => {
    try {
      const user = graphData.nodes.find(n => n.id === userId);
      if (!user) {
        toast.error('User not found');
        return;
      }

      if (user.hobbies.includes(hobby)) {
        toast.error('User already has this hobby');
        return;
      }

      const newHobbies = [...user.hobbies, hobby];
      await updateUser(userId, { hobbies: newHobbies });
    } catch (error) {
      console.error(error);
    }
  }, [graphData, updateUser]);

  return (
    <AppContext.Provider
      value={{
        users,
        graphData,
        loading,
        fetchUsers,
        fetchGraphData,
        createUser,
        updateUser,
        deleteUser,
        createFriendship,
        removeFriendship,
        addHobbyToUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};