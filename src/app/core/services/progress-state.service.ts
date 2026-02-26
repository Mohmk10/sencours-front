import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressStateService {
  private progressUpdated = new BehaviorSubject<number | null>(null);
  progressUpdated$ = this.progressUpdated.asObservable();

  notifyProgressUpdate(courseId: number) {
    this.progressUpdated.next(courseId);
  }
}
