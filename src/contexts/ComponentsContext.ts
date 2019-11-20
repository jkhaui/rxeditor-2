import { createContext } from 'react';
import { componentsStore } from '../stores/ComponentsStore';

const ComponentsContext = createContext(componentsStore);

export default ComponentsContext;
