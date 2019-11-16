import { Subject } from 'rxjs';

const subject$ = new Subject();

export const suggestionsService = {
  sendSuggestions: (suggestions: any) => subject$.next(suggestions),
  getSuggestions: () => subject$.asObservable(),
};
