export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  courseTitle: string;
  courseThumbnail?: string;
  instructorName: string;
  progress: number;
  enrolledAt: string;
}

export interface Progress {
  id: number;
  lessonId: number;
  lessonTitle: string;
  completed: boolean;
  completedAt?: string;
}
