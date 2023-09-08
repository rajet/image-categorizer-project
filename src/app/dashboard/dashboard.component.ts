import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { map } from 'rxjs';

export interface ApprovalInputData {
  categoryDescription: string;
}
export interface ApprovalOutputData {
  approval: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(public matDialog: MatDialog) {}
  getApproval() {
    const categoryDescription: ApprovalInputData = {
      categoryDescription: 'Car',
    };
    this.matDialog
      .open(ApprovalDialogComponent, {
        data: categoryDescription,
      })
      .afterClosed()
      .pipe(map((result) => result as ApprovalOutputData))
      .subscribe((result) => console.log('result: ', result.approval));
  }
}
