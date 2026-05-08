import apiClient from './apiClient';
import type { Category, CreateCategoryPayload } from '@/types/models';

export const categoriesAPI = {
  list: () =>
    apiClient.get<Category[]>('/categories'),

  create: (data: CreateCategoryPayload) =>
    apiClient.post<Category>('/categories', data),

  get: (id: string) =>
    apiClient.get<Category>(`/categories/${id}`),

  update: (id: string, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/categories/${id}`),

  getDefaults: () =>
    apiClient.get<Category[]>('/categories/defaults'),

  createDefaults: () =>
    apiClient.post('/categories/create-defaults'),
};
