import React, { ReactNode, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CenteredModalShell } from '@/components/overlays/CenteredModalShell';
import { EnterpriseModalHeader } from '@/components/overlays/EnterpriseModalHeader';

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

  const sizeWidth = {
    sm: 600,
    md: 720,
    lg: 960,
  };

  return (
    <CenteredModalShell
      header={
        <EnterpriseModalHeader
          title={
            <div className="flex flex-col gap-1">
              <span>{title}</span>
              {description && (
                <span className="text-sm font-normal text-muted-foreground">{description}</span>
              )}
            </div>
          }
        />
      }
      open={open}
      onClose={onClose}
      width={sizeWidth[size]}
      footer={footer}
    >
      {tabs ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-4">
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-0">
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      ) : (
        <div className="mt-4" />
      )}
    </CenteredModalShell>
  );
}
