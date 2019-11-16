import { createContext } from 'react';
import { editorStore } from './RxEditorStore';

const RxEditorContext = createContext(editorStore);

export default RxEditorContext;
