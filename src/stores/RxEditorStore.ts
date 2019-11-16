import { observable, computed, action } from 'mobx';
import { fromStream } from 'mobx-utils';
import { BehaviorSubject, interval } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { convertFromRaw, EditorState } from 'draft-js';

import { getCaretCoordinates } from '../core/layout';
import { handleStream } from '../reducers';

import { LOCAL_STORAGE_KEY } from '../utils/constants';
import {
  HIDDEN,
  INIT_PAYLOAD,
  VISIBLE,
} from '../components/RxEditor/utils/constants';

import { IAction, CaretState } from '../types/rxEditor';

// import { setTypingState } from '../components/RxEditor/utils/utils';
// TODO: This is quite messy and must be properly cleaned up (UI state not
//  related to the editor should be moved into `ComponentsStore` or kept
//  within the local component state if it does not need to be shared.

/**
 * The global store containing the editor state, which is updated after
 * events have been passed through the RxJS middleware.
 */
class RxEditorStore {
  // Get our initial state from local storage if it exists, otherwise render
  // an empty editor.
  @observable initialState = (
    window.localStorage.getItem(LOCAL_STORAGE_KEY)
      ? EditorState.createWithContent(
      convertFromRaw(
        JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)!),
      ),
      )
      : EditorState.createEmpty()
  );

  // Converts our initial editor state into an observable stream.
  // From here we can perform Rx operations to manipulate the editor's
  // state in response to UI events and avoid state race conditions.
  @observable editorState$ = new BehaviorSubject(this.initialState);

  // The editor state should always be read from `editorState.current`.
  @observable editorState = fromStream(this.editorState$);

  // @observable testIsTyping = (e: any) =>
  // console.log(transformTypingStatus(e));

  // Action streams are used to manipulate things like formatting (e.g.
  // bold, italic).
  @observable action$ = new BehaviorSubject({
    type: '@INIT',
    payload: INIT_PAYLOAD,
  });

  // The dispatch handler is used to update the editor state
  @action dispatch = (action: IAction) => this.action$.next(action);

  // Combine our action stream and editor state stream into a single observable.
  @observable actionSubscription = this.action$.pipe(
    withLatestFrom(this.editorState$),
  )
    .subscribe(handleStream(this.editorState$));

  @computed get caretPosition() {
    return getCaretCoordinates(window);
  }

  // N.b. MobX only "reacts" to mutations invoked on an object's properties,
  // because JavaScript primitive values are immutable.
  // Therefore, even a simple boolean value should be nested within an
  // object to correctly trigger a reaction when appropriate.
  @observable readOnlyState = {
    locked: false,
  };
  @action lockEditor = () => this.readOnlyState.locked = true;
  @action unlockEditor = () => this.readOnlyState.locked = false;

  @observable scrollState = {
    locked: false,
  };
  @action lockScrolling = () => this.scrollState.locked = true;
  @action unlockScrolling = () => this.scrollState.locked = false;

  @observable highlightColor = '#8CFF0D';
  @action setHighlightColor = (color: string) => this.highlightColor = color;

  @observable copiedState = {
    isCopied: false,
  };
  @action toggleCopiedState = () =>
    this.copiedState.isCopied = !this.copiedState.isCopied;

  @action toggleLockedEditorState = () => {
    this.readOnlyState.locked = !this.readOnlyState.locked;
    this.scrollState.locked = !this.scrollState.locked;
  };

  @observable savedDocsModalState = {
    isOpen: false,
  };
  @action toggleSavedDocsModalState = () => {
    this.savedDocsModalState.isOpen = !this.savedDocsModalState.isOpen;
    this.toggleLockedEditorState();
  };

  @observable newDocModalState = {
    isOpen: false,
  };
  @action toggleNewDocModalState = () => {
    this.newDocModalState.isOpen = !this.newDocModalState.isOpen;
    this.toggleLockedEditorState();
  };

  @observable downloadDocModalState = {
    isOpen: false,
  };
  @action toggleDownloadDocModalState = () => {
    this.downloadDocModalState.isOpen = !this.downloadDocModalState.isOpen;
    this.toggleLockedEditorState();
  };

  @observable inlineToolbarVisible = false;
  @action setInlineToolbarVisible = (state: boolean) =>
    this.inlineToolbarVisible = state;

  @observable currentDocTitle = '';
  @action setCurrentDocTitle = (title: string) => this.currentDocTitle = title;

  @observable titleFocused = false;
  @action toggleTitleFocus = () =>
    this.titleFocused = !this.titleFocused;

  @observable isFocused = true;
  @action onBlur = () => this.isFocused = false;
  @action onFocus = () => this.isFocused = true;

  @observable caretVisibility = VISIBLE;
  @action setCaretVisibility = (state: CaretState) =>
    this.caretVisibility = state;

  @observable shouldCaretBlink = true;
  @action toggleCaretBlinking = () =>
    this.shouldCaretBlink = !this.shouldCaretBlink;
  @action stopCaretBlinking = () => this.shouldCaretBlink = false;
  @action startCaretBlinking = () => this.shouldCaretBlink = true;

  @action blinkTest = () => interval(750).pipe(
    // Every 750ms, the observable will emit the next number in the
    // sequence starting from 0. From here, we can use the modulus
    // operator to determine if it is odd/even and toggle the caret
    // visibility accordingly.
    tap((x: number) => x % 2 === 0
      ? this.setCaretVisibility(HIDDEN)
      : this.setCaretVisibility(VISIBLE),
    ),
    tap(() => console.log('blinking')),
  );

  @observable isTyping = false;
  @action setIsTyping = (state: boolean) => this.isTyping = state;
}

const editorStore = new RxEditorStore();

export { editorStore };

// TODO: Create new store for layout (line width and page height).
