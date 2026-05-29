'use client';

import { createDevTools } from '@redux-devtools/core';
import { DockMonitor } from '@redux-devtools/dock-monitor';
import { InspectorMonitor } from '@redux-devtools/inspector-monitor';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q" defaultIsVisible={false}>
    <InspectorMonitor />
  </DockMonitor>
);

export default DevTools;
