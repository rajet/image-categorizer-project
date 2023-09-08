import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [DashboardComponent, ApprovalDialogComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class DashboardModule {}
