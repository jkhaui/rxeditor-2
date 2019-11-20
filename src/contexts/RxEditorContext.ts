import { createContext } from 'react';
import { editorStore } from '../stores/RxEditorStore';

const RxEditorContext = createContext(editorStore);

export default RxEditorContext;
