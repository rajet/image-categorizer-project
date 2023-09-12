import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { from, map, Observable, switchMap } from 'rxjs';
import { Category } from '../types/category.types';
import { Firestore } from '@angular/fire/firestore';
import { collection, addDoc } from '@firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseFunctionsService } from '../service/firebase-functions.service';
import { Annotation, annotationMap } from '../types/annotation.types';
import { AuthService } from '../service/auth.service';

export interface ApprovalInputData {
  categoryDescription: string;
}
export interface ApprovalOutputData extends ApprovalInputData {
  approval: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  uploadedImageData: string | ArrayBuffer | null | undefined = null;
  isLoading = false;

  constructor(
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private afs: Firestore,
    private afAuth: Auth,
    private storage: Storage,
    private firebaseFunctionsService: FirebaseFunctionsService,
    private authService: AuthService,
  ) {}

  onDragOver(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      await this.handleImageUpload(files);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    await this.handleImageUpload(files);
  }

  async logout() {
    await this.authService.logout();
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
      };
      reader.readAsDataURL(imageFile);
      this.getApproval(imageFile);
    }
  }
  private getApproval(imagefile: File) {
    const analyzeImageObservable$ = new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.firebaseFunctionsService.analyzeImage(e.target?.result).subscribe({
          next: (res) => observer.next(res),
          error: (err) => observer.error(err),
        });
      };
      reader.readAsDataURL(imagefile);
      this.isLoading = true;
    });

    analyzeImageObservable$
      .pipe(
        switchMap((analysisResult) => {
          const categoryDescription: ApprovalInputData = {
            categoryDescription:
              this.findAnnotationInAnnotationMap(analysisResult),
          };
          return this.matDialog
            .open(ApprovalDialogComponent, {
              data: categoryDescription,
            })
            .afterClosed();
        }),
        map((result) => result as ApprovalOutputData),
        map(
          (approvalOutput) =>
            ({
              img: imagefile.name,
              category: approvalOutput.categoryDescription,
              approval: approvalOutput.approval,
              email: this.afAuth.currentUser?.email,
              timestamp: new Date(),
            }) as Category,
        ),
        switchMap(async (cat) => {
          // save the image to storage
          await uploadBytes(
            ref(this.storage, 'Images_Uploaded/' + imagefile.name),
            imagefile,
          );

          this.isLoading = false;
          return from(addDoc(collection(this.afs, 'categories'), cat));
        }),
      )
      .subscribe();
  }

  private findAnnotationInAnnotationMap(
    analysisResult: Annotation[] | unknown,
  ) {
    let foundKey = 'Undefined';
    if (!(analysisResult instanceof Array)) {
      return foundKey;
    }
    (analysisResult as Annotation[]).forEach((annotation) => {
      for (const [key, values] of annotationMap.entries()) {
        if (values.includes(annotation.description)) {
          foundKey = key;
        }
      }
    });
    return foundKey;
  }
}
