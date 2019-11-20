import { createContext } from 'react';
import { footnoteStore } from '../stores/FootnoteStore';

const FootnoteContext = createContext(footnoteStore);

export default FootnoteContext;
