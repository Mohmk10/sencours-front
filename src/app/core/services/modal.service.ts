import { Injectable } from '@angular/core';

export interface ModalConfig {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModalService {

  confirm(config: ModalConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const result = window.confirm(config.message);
      resolve(result);
    });
  }

  alert(config: Omit<ModalConfig, 'showCancel'>): Promise<void> {
    return new Promise((resolve) => {
      window.alert(config.message);
      resolve();
    });
  }
}
