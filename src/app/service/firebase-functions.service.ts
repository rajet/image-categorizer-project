import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import {
  Functions,
  FunctionsInstances,
  httpsCallable,
} from '@angular/fire/functions';
import { Functions as FirebaseFunctions } from '@firebase/functions';

export enum FirebaseFunctionNames {
  analyzeImage = 'analyzeImageCloudFunction',
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseFunctionsService {
  constructor(
    private functions: Functions,
    private functionInstances: FunctionsInstances,
  ) {}

  private get functionInstance(): FirebaseFunctions {
    return this.functionInstances[0];
  }
  analyzeImage(): Observable<string | undefined> {
    return this.callFunctionWithName(
      FirebaseFunctionNames.analyzeImage,
      undefined,
    );
  }

  private callFunctionWithName(
    name: FirebaseFunctionNames,
    data: unknown,
  ): Observable<string | undefined> {
    const firebaseFunction = httpsCallable(this.functionInstance, name);

    return from(firebaseFunction(data)).pipe(
      map((result) => result?.data as string),
    );
  }
}
