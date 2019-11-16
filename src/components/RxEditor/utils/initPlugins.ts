import createFormattingOptionsPlugin
  from '../../../extensions/plugins/formattingOptions/formattingOptionsPlugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createInlineToolbarPlugin
  from '../../../extensions/plugins/InlineToolbar';
import createLinkPlugin from '../../../extensions/plugins/AnchorPlugin';

const linkifyPlugin = createLinkifyPlugin();
export const linkPlugin = createLinkPlugin({
  placeholder: 'Type link URL & press enter',
});
export const inlineToolbarPlugin = createInlineToolbarPlugin();
export const formattingOptionsPlugin = createFormattingOptionsPlugin();

export const plugins = [inlineToolbarPlugin, linkPlugin,
  formattingOptionsPlugin, linkifyPlugin];
