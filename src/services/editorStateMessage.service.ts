import { Subject } from 'rxjs';

import { RxEditorActionPayload } from '../types/rxEditor';

const subject$ = new Subject();

export const editorStateMessageService = {
  sendEditorState: (payload: RxEditorActionPayload) => subject$.next({ payload }),
  getEditorState: () => subject$.asObservable(),
};
