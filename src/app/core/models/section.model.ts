export interface Section {
  id: number;
  title: string;
  orderIndex: number;
  courseId: number;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: number;
  title: string;
  content?: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ';
  duration?: number;
  orderIndex: number;
  isFree: boolean;
  videoUrl?: string;
  sectionId: number;
}
