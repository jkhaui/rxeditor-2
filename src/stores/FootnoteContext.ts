import { createContext } from 'react';
import { footnoteStore } from './FootnoteStore';

const FootnoteContext = createContext(footnoteStore);

export default FootnoteContext;
