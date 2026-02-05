export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  courseTitle: string;
  courseThumbnail?: string;
  instructorName: string;
  enrolledAt: string;
  progressPercentage?: number;
}

export interface Progress {
  id: number;
  lessonId: number;
  lessonTitle: string;
  completed: boolean;
  completedAt?: string;
}
