// export const DRAFT_PLACEHOLDER_ELEMENT =
// '.public-DraftEditorPlaceholder-root';

export const UNSTYLED_BLOCK_TYPE = 'unstyled';
export const UNSTYLED_ALT_BLOCK_TYPE = 'unstyled-alt';
export const CHANGE_BLOCK_TYPE_CHANGE_TYPE = 'change-block-type';
export const CHANGE_INLINE_STYLE_CHANGE_TYPE = 'change-inline-style';
export const INSERT_CHARACTERS_CHANGE_TYPE = 'insert-characters';
export const INSERT_FRAGMENT_CHANGE_TYPE = 'insert-fragment';
export const SPLIT_BLOCK_CHANGE_TYPE = 'split-block';

export const HANDLED = 'handled';
export const NOT_HANDLED = 'not-handled';

export const UNDO_PAYLOAD = 'UNDO';
export const REDO_PAYLOAD = 'REDO';
export const BOLD_PAYLOAD = 'BOLD';
export const ITALIC_PAYLOAD = 'ITALIC';
export const UNDERLINE_PAYLOAD = 'UNDERLINE';
export const STRIKETHROUGH_PAYLOAD = 'STRIKETHROUGH';
export const SUPERSCRIPT_PAYLOAD = 'SUPERSCRIPT';
export const SUBSCRIPT_PAYLOAD = 'SUBSCRIPT';
export const HIGHLIGHT_PAYLOAD = 'HIGHLIGHT';
export const DOWNLOAD_PAYLOAD = 'DOWNLOAD';
export const INIT_PAYLOAD = 'INIT';
export const SAVE_PAYLOAD = 'SAVE';
export const LOAD_PAYLOAD = 'LOAD';
export const COPY_PAYLOAD = 'COPY';
export const CUT_PAYLOAD = 'CUT';
export const PRINT_PAYLOAD = 'PRINT';
export const SMALL_CAPS_PAYLOAD = 'SMALL_CAPS';

export const UNDO_SHORTCUT = 'Ctrl + Z';
export const REDO_SHORTCUT = 'Ctrl + Y';
export const ITALIC_SHORTCUT = 'Ctrl + I';
export const BOLD_SHORTCUT = 'Ctrl + B';
export const UNDERLINE_SHORTCUT = 'Ctrl + U';
export const LINK_SHORTCUT = 'Ctrl + K';
export const COPY_SHORTCUT = 'Ctrl + C';
export const PRINT_SHORTCUT = 'Ctrl + P';
export const HIGHLIGHT_SHORTCUT = 'Alt + H';

export const TAB_UNICODE = '\u0009';
export const COPYRIGHT = '©';
export const REGISTERED_TRADEMARK = '®';
export const ARROW_SYMBOL = '→';
export const EN_DASH = '-';
export const EM_DASH = '\u2014';

export const RX_EDITOR_PLACEHOLDER = 'Start writing! 😄';

export const keyMap = {
  INSERT_FOOTNOTE: 'ctrl+/',
  TOGGLE_DROPDOWN: 'ctrl+shift+f',
  TOGGLE_OPTIONS_PANEL: 'ctrl+shift+p',
  TOGGLE_KEYBOARD_SHORTCUTS: 'ctrl+k',
};

export const NUMBERS_REGEX = /\d+/;
export const LOWER_CASE_REGEX = /[a-z]/;
export const COPYRIGHT_REGISTERED_TRADEMARK_REGEX = /(\(([cr]))/;
export const EN_DASH_REGEX = /\s-(?!(\w|\d))/;
export const NON_CAPITALISED_REGEX = /(?:\S\.\s)([a-z])/;
// /(?:\S([.!?])\s)([a-z])/;
// export const NON_CAPITALISED_REGEX = /^(?:\.\.\s)([a-z])$/;
export const NUMBERS_AT_START_OF_SENTENCE_REGEX = /(?:\.\s)(\d+)(?:\s)/;
export const UNITS_REGEX =
  /((?:\s)(\d+)((cm)|(mg)|(mm)|(g)|(kg)|(m)|(gb)|(mb)|(kj)))/;

export const RXEDITOR_PAGE = 'RxEditor-Page';
export const RXEDITOR_PAGE_LINE = 'RxEditor-Page-Line';
export const RXEDITOR_SIDEDRAWER = 'RxEditor-SideDrawer';
export const RXEDITOR_SCROLLBAR = 'RxEditor-Scrollbar';
export const RXEDITOR_CONTEXTMENU = 'RxEditor-ContextMenu';
export const RXEDITOR_FOOTNOTE_DIVIDER = 'RxEditor-Footnote-Divider';

export const keyExceptions = [' ', 'PageUp', 'PageDown', 'Alt', 'Enter',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace',
  'Tab', 'Esc', 'Delete', 'End'];
export const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
export const dragEvents = ['drag', 'dragstart'];
export const clickEvents = ['click', 'dblclick'];
export const keyEvents = ['keyup', 'keydown', 'keypress'];

export const VISIBLE = 'visible';
export const HIDDEN = 'hidden';

export const INLINE_STYLE_ACTION = 'inlineStyle';
export const CREATE_LINK_ACTION = 'createLink';
export const CREATE_FOOTNOTE_POINTER_ACTION = 'createFootnotePointer';
export const SAVE_ACTION = 'save';
export const LOAD_ACTION = 'load';
export const UNDO_REDO_ACTION = 'undoRedo';
