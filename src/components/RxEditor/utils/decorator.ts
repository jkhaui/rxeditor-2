import { entityStrategy } from './strategy';
import Link from '../Entities/Link';
import FootnotePointer from '../Entities/FootnotePointer';

export const customDecorators = [
  {
    strategy: entityStrategy('LINK'),
    component: Link,
  },
  {
    strategy: entityStrategy('FOOTNOTE-POINTER'),
    component: FootnotePointer,
  },
];