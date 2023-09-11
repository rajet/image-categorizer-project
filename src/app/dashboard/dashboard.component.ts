import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { map } from 'rxjs';
import { Category } from '../types/category.types';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ref, Storage, uploadBytes } from '@angular/fire/storage';

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
  uploadedImageData: string | ArrayBuffer | null | undefined = null;

  constructor(
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private afs: Firestore,
    private afAuth: Auth,
    private storage: Storage
  ) {}

  onDragOver(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      this.handleImageUpload(files);
    }
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    this.handleImageUpload(files);
  }

  private handleImageUpload(files: FileList | null): void {
    if (files && files.length > 0) {
      // We don't allow multi-image upload so only take 1 no matter the situation
      const imageFile = files[0];
      // Only accept jpg and png images
      if (imageFile.type != 'image/jpeg' && imageFile.type != 'image/png') {
        this.matSnackBar.open('Only JPG and PNG images are allowed.', 'x', {
          duration: 3000,
        });
        return;
      }

      // TODO: Handle the image file.
      // For now just log to console
      console.log('Uploaded image:', imageFile);
      // and show on page to check that we have image data
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImageData = e.target?.result;
      };
      reader.readAsDataURL(imageFile);


      this.getApproval();
    }
  }
  private getApproval() {
    const categoryDescription: ApprovalInputData = {
      categoryDescription: 'Car',
    };

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
              email: this.afAuth.currentUser?.email,
            }) as Category,
        ),
      )
      .subscribe(
        async (cat) => await addDoc(collection(this.afs, 'categories'), cat),
      );
  }
}
