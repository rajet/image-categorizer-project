import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { from, map, switchMap } from 'rxjs';
import { Category } from '../types/category.types';
import { Firestore } from '@angular/fire/firestore';
import { collection, addDoc } from '@firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseFunctionsService } from '../service/firebase-functions.service';

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
    private storage: Storage,
    private firebaseFunctionsService: FirebaseFunctionsService,
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

  async onFileSelected(event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    await this.handleImageUpload(files);
  }

  private async handleImageUpload(files: FileList | null): Promise<void> {
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
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImageData = e.target?.result;
        this.firebaseFunctionsService
          .analyzeImage(e.target?.result)
          .subscribe((result) => console.log('result: ', result));
      };
      reader.readAsDataURL(imageFile);
      console.log('image: §', imageFile);
    }
  }

  arrayBufferToString(buffer: ArrayBuffer): string {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(buffer);
  }

  private getApproval(file: File) {
    const categoryDescription: ApprovalInputData = {
      categoryDescription: 'Car',
    };

    this.matDialog
      .open(ApprovalDialogComponent, {
        data: categoryDescription,
      })
      .afterClosed()
      .pipe(
        // switchMap(() => fireabasefunction)
        map((result) => result as ApprovalOutputData),
        map(
          (approvalOutput) =>
            ({
              img: file.name,
              category: categoryDescription.categoryDescription,
              approval: approvalOutput.approval,
              email: this.afAuth.currentUser?.email,
              timestamp: new Date(),
            }) as Category,
        ),
        switchMap((cat) => {
          // save the image to storage
          uploadBytes(ref(this.storage, 'Images_Uploaded/' + file.name), file);
          // save the meta information to firestore
          return from(addDoc(collection(this.afs, 'categories'), cat));
        }),
      )
      .subscribe();
  }
}
