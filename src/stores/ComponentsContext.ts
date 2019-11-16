import { createContext } from 'react';
import { componentsStore } from './ComponentsStore';

const ComponentsContext = createContext(componentsStore);

export default ComponentsContext;
