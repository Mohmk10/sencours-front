export interface Category {
  id: number;
  name: string;
  description?: string;
  courseCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}
