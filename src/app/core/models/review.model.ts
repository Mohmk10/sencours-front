export interface Review {
  id: number;
  rating: number;
  comment?: string;
  userId: number;
  userName: string;
  courseId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment?: string;
}
