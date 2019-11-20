import { fromFetch } from 'rxjs/fetch';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const authResponseFacebook = (response: any) => {
  console.log(response);
};

export const authResponseGoogle = ({ Zi: { access_token, expires_in, id_token, token_type } }: any) => {
  const payload = {
    access_token: access_token,
    expires_in: expires_in,
    id_token: id_token,
    token_type: token_type,
  };

  const data$ = fromFetch(
    'https://aglc4.com/wp-json/nextend-social-login/v1/google/get_user',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  ).pipe(
    switchMap(response => {
      if (response) {
        console.log(response.json());
        return response.json();
      } else {
        return of({
          error: true,
          message: 'Error',
        });
      }
    }),
    catchError(err => {
      console.error(err);
      return of({
        error: true,
        message: err.message,
      });
    }),
  );

  data$.subscribe({
    next: result => console.log(result),
    complete: () => console.log('done'),
  });
};