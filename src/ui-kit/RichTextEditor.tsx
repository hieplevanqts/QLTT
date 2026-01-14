import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Undo,
  Redo,
  Type
} from 'lucide-react';
import styles from './RichTextEditor.module.css';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  disabled = false,
  error = false,
  minHeight = '120px',
  maxHeight = '400px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Set initial content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const addLink = () => {
    const url = prompt('Nhập URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const toolbarButtons = [
    { icon: <Bold size={16} />, command: 'bold', title: 'Đậm (Ctrl+B)' },
    { icon: <Italic size={16} />, command: 'italic', title: 'Nghiêng (Ctrl+I)' },
    { icon: <Underline size={16} />, command: 'underline', title: 'Gạch chân (Ctrl+U)' },
    { icon: <List size={16} />, command: 'insertUnorderedList', title: 'Danh sách' },
    { icon: <ListOrdered size={16} />, command: 'insertOrderedList', title: 'Danh sách đánh số' },
    { icon: <LinkIcon size={16} />, command: 'link', title: 'Chèn liên kết', onClick: addLink },
    { icon: <Undo size={16} />, command: 'undo', title: 'Hoàn tác (Ctrl+Z)', separator: true },
    { icon: <Redo size={16} />, command: 'redo', title: 'Làm lại (Ctrl+Y)' },
  ];

  return (
    <div className={`${styles.container} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.toolbar}>
        {toolbarButtons.map((btn, index) => (
          <div key={index} style={{ display: 'contents' }}>
            {btn.separator && <div className={styles.separator} />}
            <button
              type="button"
              className={styles.toolbarButton}
              onClick={() => btn.onClick ? btn.onClick() : execCommand(btn.command)}
              title={btn.title}
              disabled={disabled}
              onMouseDown={(e) => e.preventDefault()}
            >
              {btn.icon}
            </button>
          </div>
        ))}
      </div>
      
      <div
        ref={editorRef}
        className={`${styles.editor} ${isFocused ? styles.focused : ''}`}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{ 
          minHeight,
          maxHeight,
        }}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;