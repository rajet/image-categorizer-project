import { Component } from '@angular/core';
import { Firestore, collectionData, query } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable, map } from 'rxjs';
import { Category } from 'src/app/types/category.types';
import { Auth } from '@angular/fire/auth';

export interface StatisticViewModel {
  totalCorrect: number;
  totalIncorrect: number;
  totalUserCorrect: number;
  totalUserIncorrect: number;
}

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent {
  dbStatistics$?: Observable<StatisticViewModel>;

  constructor(
    private fireStore: Firestore,
    private auth: Auth,
  ) {
    // Load the statistic data
    this.loadData();
  }

  private async loadData() {
    console.log('loading data for statistic...');

    this.dbStatistics$ = collectionData(
      query(collection(this.fireStore, 'categories')),
      { idField: 'id' },
    ).pipe(
      map((documentData) => documentData.map((d) => d as Category)),
      map((categories) => {
        const statisticViewModel: StatisticViewModel = {
          totalCorrect: categories.filter((c) => c.approval).length,
          totalIncorrect: categories.filter((c) => !c.approval).length,
          totalUserCorrect: categories.filter(
            (c) => c.email === this.auth.currentUser?.email && c.approval,
          ).length,
          totalUserIncorrect: categories.filter(
            (c) => c.email === this.auth.currentUser?.email && !c.approval,
          ).length,
        };
        return statisticViewModel;
      }),
    );
  }
}
