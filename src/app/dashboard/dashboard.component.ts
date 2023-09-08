import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { map } from 'rxjs';
import { Category } from '../types/category.types';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

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
  constructor(
    private matDialog: MatDialog,
    private afs: Firestore,
  ) {}
  getApproval() {
    const categoryDescription: ApprovalInputData = {
      categoryDescription: 'Car',
    };
    console.log('firestore: ', this.afs);

    this.matDialog
      .open(ApprovalDialogComponent, {
        data: categoryDescription,
      })
      .afterClosed()
      .pipe(
        map((result) => result as ApprovalOutputData),
        map(
          (approvalOutput) =>
            ({
              img: '',
              category: categoryDescription.categoryDescription,
              approval: approvalOutput.approval,
            }) as Category,
        ),
      )
      .subscribe(
        async (cat) => await addDoc(collection(this.afs, 'categories'), cat),
      );
  }
}
