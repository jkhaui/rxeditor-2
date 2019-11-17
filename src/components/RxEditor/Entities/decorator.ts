import { entityStrategy } from './strategy';
import Link from './Link';
import FootnotePointer from './FootnotePointer';

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