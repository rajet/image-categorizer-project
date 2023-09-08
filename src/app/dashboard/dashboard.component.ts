import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  uploadedImageData: string | ArrayBuffer | null | undefined = null;

  constructor(
    private matSnackBar: MatSnackBar
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
      if (imageFile.type != "image/jpeg" && imageFile.type != "image/png") {
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
    }
  }
}
