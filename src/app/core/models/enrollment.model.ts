export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  courseTitle: string;
  courseThumbnail?: string;
  instructorName?: string;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  paymentReference?: string;
  paymentMethod?: string;
  amountPaid?: number;
  totalLessons?: number;
  completedLessons?: number;
}

export interface Progress {
  id: number;
  lessonId: number;
  lessonTitle: string;
  completed: boolean;
  completedAt?: string;
  watchTimeSeconds?: number;
  lastPositionSeconds?: number;
}

export interface EnrollmentRequest {
  paymentMethod: string;
  paymentPhone?: string;
}

export interface PaymentResponse {
  reference: string;
  status: string;
  message: string;
  amount: number;
  method: string;
}
