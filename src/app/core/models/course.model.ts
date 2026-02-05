export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  instructorId: number;
  instructorName: string;
  categoryId: number;
  categoryName: string;
  averageRating?: number;
  totalEnrollments?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreateRequest {
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  categoryId: number;
}

export interface CourseUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  categoryId?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
