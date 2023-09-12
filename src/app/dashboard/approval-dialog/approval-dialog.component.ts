import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApprovalInputData, ApprovalOutputData } from '../dashboard.component';

@Component({
  selector: 'app-approval-dialog',
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.scss'],
})
export class ApprovalDialogComponent {
  approvalInputData: ApprovalInputData;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: ApprovalInputData,
    private matDialogRef: MatDialogRef<ApprovalDialogComponent>,
  ) {
    matDialogRef.disableClose = true;
    this.approvalInputData = data;
  }

  approve(approval: boolean) {
    const approvalContent: ApprovalOutputData = {
      approval,
      categoryDescription: this.approvalInputData.categoryDescription,
    };
    this.matDialogRef.close(approvalContent);
  }
}
