import React, { useState, useRef, useEffect } from 'react';
import { Editor, NodeViewRenderer, PMRenderer } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Paragraph from '@tiptap/extension/paragraph';
import { Text } from '@tiptap/extension/text';
import Bold from '@tiptap/extension/bold';
import Italic from '@tiptap/extension/italic';
import Strikethrough from '@tiptap/extension/strikethrough';
import Heading from '@tiptap/extension/heading';
import Toolbar from '@tiptap/extension/toolbar';
import ToolbarIcon from '@tiptap/extension/toolbar-icon';
import { useEditor, usePlugins } from '@tiptap/react';

function TextEditor() {
  const [editor, setEditor] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && !editor) {
      const newEditor = new Editor({
        content: {
        },
        extensions: [
          Paragraph.configure(),
          Text.configure(),
          Bold.configure(),
          Italic.configure(),
          Strikethrough.configure(),
          Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
          Toolbar.configure({
            icons: [
              new ToolbarIcon({
                type: Bold,
                icon: 'bold',
                content: 'bold',
              }),
              new ToolbarIcon({
                type: Italic,
                icon: 'italic',
                content: 'italic',
              }),
              new ToolbarIcon({
                type: Strikethrough,
                icon: 'strikethrough',
                content: 'strikethrough',
              }),
              new ToolbarIcon({
                type: Heading,
                icon: 'heading',
                content: 'heading',
              }),
            ],
          }),
        ],
        editable: true,
        pmRenderer: new PMRenderer({
        }),
      });
      setEditor(newEditor);
    }
  }, [contentRef]);

  const handleContentChange = (newContent) => {
    console.log('Editor content:', newContent);
  };

  return (
    <div ref={contentRef}>
      {editor && (
        <>
          <Toolbar editor={editor} />
          <Editor editor={editor} onUpdate={handleContentChange} />
        </>
      )}
    </div>
  );
}

export default TextEditor;