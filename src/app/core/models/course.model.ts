import { Section } from './section.model';

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  instructorId: number;
  instructorName?: string;
  instructorFirstName?: string;
  instructorLastName?: string;
  categoryId: number;
  categoryName: string;
  averageRating: number;
  enrollmentCount: number;
  reviewCount: number;
  sections?: Section[];
  totalLessons?: number;
  totalDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreateRequest {
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  categoryId: number;
  instructorId: number;
}

export interface CourseUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  categoryId?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
