import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Tous les cours</h1>
      <p class="text-gray-600">Chargement des cours...</p>
    </div>
  `
})
export class CourseListComponent {}
