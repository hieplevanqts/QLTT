import { useState, useRef, useEffect, createContext, useContext } from 'react';
import styles from './DropdownMenu.module.css';

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within DropdownMenu');
  }
  return context;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={styles.dropdown}>{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useDropdownContext();
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div
      ref={triggerRef}
      className={styles.trigger}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
    </div>
  );
}

export function DropdownMenuContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useDropdownContext();

  if (!isOpen) return null;

  return <div className={styles.content}>{children}</div>;
}

export function DropdownMenuItem({
  children,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
}) {
  const { setIsOpen } = useDropdownContext();

  const handleClick = () => {
    onClick?.();
    setIsOpen(false);
  };

  const className = variant === 'destructive' 
    ? `${styles.item} ${styles['item-destructive']}`
    : styles.item;

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
