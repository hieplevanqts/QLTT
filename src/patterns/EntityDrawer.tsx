import React, { ReactNode, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../app/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';
import { Button } from '../app/components/ui/button';
import { ScrollArea } from '../app/components/ui/scroll-area';

interface EntityDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  defaultTab?: string;
  tabs?: {
    value: string;
    label: string;
    content: ReactNode;
  }[];
  footer?: ReactNode;
}

export default function EntityDrawer({
  open,
  onClose,
  title,
  description,
  size = 'md',
  defaultTab,
  tabs,
  footer,
}: EntityDrawerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs?.[0]?.value);

  // Update active tab when defaultTab changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const sizeClasses = {
    sm: 'w-[33vw]',
    md: 'w-[50vw]',
    lg: 'w-[66vw]',
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className={`flex flex-col ${sizeClasses[size]}`}>
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle>{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {tabs ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollArea className="flex-1 mt-4">
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                  {tab.content}
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        ) : (
          <ScrollArea className="flex-1 mt-4">
            {/* Default content if no tabs */}
          </ScrollArea>
        )}

        {footer && (
          <div className="border-t border-border pt-4 mt-4">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}