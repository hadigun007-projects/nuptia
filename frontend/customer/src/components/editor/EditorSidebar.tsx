import React, { useState } from 'react';
import { Tab } from '../../types';
import { MENU_ITEMS_15, MenuItemDef, CATEGORY_STEPS } from './menuConstants';
import { TimelineSidebar, TIMELINE_STEPS } from './TimelineSidebar';
import { Ic } from '../common/Icons';

export { TIMELINE_STEPS };

interface EditorSidebarProps {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
  isTimelineMode?: boolean;
  onToggleMode?: () => void;
  completedSteps?: Partial<Record<Tab, boolean>>;
  visitedTabs?: Set<Tab>;
}


export function EditorSidebar({
  activeTab,
  onSelectTab,
  isTimelineMode = false,
  onToggleMode,
  completedSteps = {},
  visitedTabs,
}: EditorSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [internalTimelineMode, setInternalTimelineMode] = useState(isTimelineMode);

  // Sync internal state if prop changes
  const effectiveTimelineMode = onToggleMode ? isTimelineMode : internalTimelineMode;
  const handleToggleMode = onToggleMode || (() => setInternalTimelineMode((prev) => !prev));

  if (effectiveTimelineMode) {
    return (
      <TimelineSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        completedSteps={completedSteps}
        visitedTabs={visitedTabs}
        isTimelineMode={true}
        onToggleMode={handleToggleMode}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
    );
  }

  const getDef = (id: Tab): MenuItemDef => {
    return MENU_ITEMS_15.find((m) => m.id === id) || MENU_ITEMS_15[0];
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-surface transition-all duration-300 flex-shrink-0 z-20 sticky top-[57px] max-h-[calc(100vh-57px)] ${
        collapsed ? 'w-[74px]' : 'w-[250px]'
      }`}
    >
      {/* Top Mode switcher */}
      <div className="p-3 border-b border-outline-variant/30 space-y-2">

        {/* Mode Toggle Pill */}
        {!collapsed && (
          <div className="flex items-center p-1 rounded-xl bg-surface-container border border-outline-variant/40 text-[11px] font-semibold">
            <button
              onClick={handleToggleMode}
              className="flex-1 py-1 px-2 rounded-lg transition-all flex items-center justify-center gap-1 text-on-surface-variant hover:text-on-surface"
            >
              <Ic.Sparkles s={13} />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => {}}
              className="flex-1 py-1 px-2 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center gap-1"
            >
              <Ic.Check s={13} />
              <span>Kategori</span>
            </button>
          </div>
        )}
      </div>

      {/* Categories & 15 Menu Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {CATEGORY_STEPS.map((cat) => (
          <div key={cat.key}>
            {!collapsed && (
              <p className="px-3 pb-1 text-[10px] font-bold tracking-wider text-on-surface-variant/80 uppercase font-display">
                {cat.title}
              </p>
            )}
            <div className="space-y-1">
              {cat.items.map((tabId) => {
                const def = getDef(tabId);
                const IconComp = def.Icon;
                const isActive = activeTab === tabId;
                const isKirim = tabId === 'kirim';

                return (
                  <button
                    key={tabId}
                    onClick={() => onSelectTab(tabId)}
                    title={def.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-on-primary font-bold'
                        : 'text-on-surface hover:bg-surface-container hover:text-primary'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <span
                      className={`flex-shrink-0 transition-transform ${
                        isActive ? 'text-on-primary' : isKirim ? 'text-amber-500' : 'text-on-surface-variant'
                      }`}
                    >
                      <IconComp s={19} />
                    </span>

                    {!collapsed && (
                      <span className="truncate flex-1 text-left font-display">
                        {def.label}
                      </span>
                    )}

                    {!collapsed && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Toggle Collapse */}
      <div className="p-2 border-t border-outline-variant/30 flex items-center justify-end">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs transition-colors"
          title={collapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
        >
          <span className="transform transition-transform">
            {collapsed ? <Ic.ChevronRight s={16} /> : <Ic.ChevronLeft s={16} />}
          </span>
          {!collapsed && <span className="text-[11px] font-medium">Ciutkan Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
