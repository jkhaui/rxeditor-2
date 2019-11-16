import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError } from 'rxjs/operators';

export const keywords$ = (text: string) => fromFetch(
  'https://fqhwmafmb9.execute-api.ap-southeast-2.amazonaws.com/dev/',
  {
    method: 'post',
    body: text,
  },
)
  .pipe(
    switchMap(response => {
      if (response.ok) {
        return response.json();
      } else {
        return of({
          error: true,
          message: `Error ${response.status}`,
        });
      }
    }),
    catchError(error => {
      console.error(error);
      return of({
        error: true,
        message: error.message,
      });
    }),
  );
