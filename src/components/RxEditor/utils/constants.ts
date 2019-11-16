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
export const RXEDITOR_TOOLBAR = 'RxEditor-Toolbar';
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

export const sampleText = 'DRAFT ESSAY 1 – QUESTION 2 \n' +
  '\n' +
  'I.\tINTRODUCTION \n' +
  '\n' +
  'International law appears to leave each state complete freedom to regulate or prohibit grant each state the liberty of regulating or prohibiting  commerce within its territory and with foreign states, except in so far as it may have entered into explicit international engagements to the contrary.   The European law of civil procedure is in a constant process of improvement ;   t The Brussels Recast   is a recent demonstration of how European Union (‘EU’)  states are taking a procedural approach to international disputes. The Brussels Recast has governed the jurisdiction of EU national courts in civil and commercial matters and the recognition and enforcement of such judgements within the EU.  The purpose of the recast was to reformulate existing law in the context of contemporary conditions and needs. \n' +
  'II.\tTHE FIELD OF APPLICATION —  TORTS\n' +
  '\n' +
  'In this scenario, the first issue that needs  to be established concerns the scope of the Recast. Article 7(2) applies to ‘matters relating to tort, delicit or quasi delicit’,   where  the Court has given a very general definition to the effect that Article 7(2) comprises any claim which seeks to establish the liability of a defendant.  Examples of claims which are clearly within Article 7(2) are those relating to personal injury or damage to property when there is no contract between the parties. \n' +
  '\n' +
  'This dispute between ABC and the pedestrian (‘P’)  has occurred as ABC has committed a tort against P. Thus, for clarity, ABC is the defendant in this dispute and P is the plaintiff. As ABC is domiciled in Sophia, and the tort occurred in Salzburg —  and both states are part of the EU —  both are therefore members of the Brussels Recast.  Hence, this document will govern the decision of which jurisdiction will hear the dispute. \n' +
  '\n' +
  'III.\tHAS JURSDICTION BEEN AGREED UPON?\n' +
  'Article 25 of the Brussels Recast   establishes the principle of party autonomy:  where all EU states recognise and accept that if there is an agreement between the parties of which jurisdiction will hear the dispute, then this will be respected. However, on the facts, there is no clear agreement between the parties about which jurisdiction will apply. Thus, the articles in the Brussels Recast will be referred to, in order to determine which jurisdiction will apply. \n' +
  '\n' +
  '\n' +
  '\n' +
  'IV.\tWHICH EU STATE CAN ASSUME JURISDICTION UNDER THE BRUSSELS RECAST?\n' +
  'Mandatory Jurisdiction \n' +
  'Article 4 of the Brussels Recast establishes that if there is no party autonomy, then the plaintiff shall follow the defendant meaning,  the court proceedings will occur where the defendant is domiciled. ABC is the defendant and is domiciled in Sophia which means, as per Article 4, the jurisdiction of Sophia will govern this dispute between ABC and P. \n' +
  '\n' +
  'Special/Permissive Jurisdiction \n' +
  'Ordinarily, as per Article 4, the plaintiff has to follow the defendant, then jurisdiction in Sophia will apply. But  However, as P would like to sue in Salzburg, for Salzburg to assume jurisdiction depends on Article   Salzburg assuming jurisdiction is dependent on Article 7.  A person domiciled in one member state can be sued in another member state if certain conditions are fulfilled.  The two conditions that must be met are,  if whether the place of performance is a member state ,  and whether the defendant is from a member state . As this  is a tort, the place of performance will be where the harmful event occurred.  The understanding of what is meant by “ where the harmful event has occurred” has incurred confusion across international courts. The uncertainty created by the wording was resolved by the Court of Justice in the famous Bier   ruling. According to Bier  , the expression “the place where the harmful event occurred” is to be understood as comprising both the place of the event giving rise to the damage and the place of damage, so that the plaintiff may choose to bring an action in either of those places when they do not coincide.   Based on  On the facts, it is unambiguous that Salzburg is where the accident and damage occurred;  so,  Salzburg can assume jurisdiction over this dispute as well. \n' +
  '\n' +
  'Exclusive Jurisdiction \n' +
  'The four circumstances which call for exclusive jurisdiction do not apply to the above scenario,  t . Therefore, Article 24 does not apply on the facts. \n' +
  '\n' +
  'V.\tCONFLICTING JURISDICITONS- —  LIS PENDENS \n' +
  'Many legal systems deal with parallel litigation by requiring the second court to defer, by stay and ultimate dismissal, to the court seized first.  The underlying assumption is that both courts are otherwise ‘equal’ in their claim to have jurisdiction in the matter.  The Brussels Recast also adopts this principle. However,  it is limited in its application;,  as the conflict of parallel litigation is limited to only EU states;  where third country parallel litigation is not addressed.  As there are two conflicting jurisdictions being Sophia and Salzburg, it must be decided which court will confer on the matter. \n' +
  '\n' +
  'In normal circumstances, where several courts can have jurisdiction and there is a dispute between two parties and the same cause of action, the court that is called upon later,  must stay its proceedings in favour of the court that is first called upon.  Hence P,  will first sue in Sophia,  and then can sue in Salzburg. The Salzburg court can only dismiss the proceedings when the court in Sophia has started proceedings. \n' +
  '\n' +
  'Therefore, it is likely that the court in Sophia will have jurisdiction to govern this dispute, according to the articles of the Brussels Recast. \n' +
  '\n' +
  'VI.\tRECOGNTION AND ENFORCEMENT \n' +
  'Arguably, the Sophia court  will have jurisdiction over this dispute and according to article 36, a judgement given in a member state shall be recognised in the other Member states without any special procedure being  required.  Hence, the judgement that the Sophia court delivers will automatically be recognised in Salzburg. Furthermore, in reference to Article 39, a judgement given in a member state,  which is enforceable in that Member state, shall be enforceable in the other Member states,  without any declaration of enforceability being required.  Therefore, the Sophia court’s judgement will be automatically enforced in Salzburg. \n' +
  '\n' +
  '\n';
