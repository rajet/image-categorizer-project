import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StatisticComponent } from './statistic/statistic.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    DashboardComponent,
    ApprovalDialogComponent,
    StatisticComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
})
export class DashboardModule {}
