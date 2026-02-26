import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProgressUpdate {
  courseId: number;
  percent: number;
  completedLessons: number;
  totalLessons: number;
}

@Injectable({ providedIn: 'root' })
export class ProgressStateService {
  private progressUpdated = new BehaviorSubject<ProgressUpdate | null>(null);
  progressUpdated$ = this.progressUpdated.asObservable();

  notifyProgressUpdate(update: ProgressUpdate) {
    this.progressUpdated.next(update);
  }
}
