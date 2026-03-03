import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import FileNode from '../nodes/FileNode';
import type { FileNodeAttrs } from '../types';

export interface FileOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customFile: {
      setFile: (options: FileNodeAttrs) => ReturnType;
    };
  }
}

export const CustomFile = Node.create<FileOptions>({
  name: 'customFile',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return { 'data-id': attributes.id };
        },
      },
      path: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-path'),
        renderHTML: (attributes) => {
          if (!attributes.path) return {};
          return { 'data-path': attributes.path };
        },
      },
      fileName: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-filename'),
        renderHTML: (attributes) => {
          if (!attributes.fileName) return {};
          return { 'data-filename': attributes.fileName };
        },
      },
      size: {
        default: null,
        parseHTML: (element) => {
          const size = element.getAttribute('data-size');
          return size ? parseInt(size, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return { 'data-size': attributes.size };
        },
      },
      contentType: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-contenttype'),
        renderHTML: (attributes) => {
          if (!attributes.contentType) return {};
          return { 'data-contenttype': attributes.contentType };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="custom-file"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'custom-file',
        'data-id': HTMLAttributes['data-id'],
        'data-path': HTMLAttributes['data-path'],
        'data-filename': HTMLAttributes['data-filename'],
        'data-size': HTMLAttributes['data-size'],
        'data-contenttype': HTMLAttributes['data-contenttype'],
      }),
      '<!--custom-file-->',
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileNode);
  },

  addCommands() {
    return {
      setFile:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});