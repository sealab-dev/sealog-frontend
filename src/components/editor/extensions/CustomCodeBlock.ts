import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { lowlight } from '../utils/lowlightConfig';
import { CodeBlockNode } from '../nodes/CodeBlockNode';

// 수정: CodeBlockLowlight를 extend하여 UI만 커스터마이징
export const CustomCodeBlock = CodeBlockLowlight.extend({
  addOptions(): any {
    return {
      ...this.parent?.(),
      lowlight,
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNode);
  },
});