import type { PhysicalControls } from 'fujimod';
import type { ControlInput } from 'fujimod/emulator';
import type { ControlNode, DevicePanel } from '@fujimod/emulator-ui/ui/layout';
import { defaultLayout } from '@fujimod/emulator-ui/ui/default-layout';
import xh2 from './panels/xh2.json' with { type: 'json' };

/** Hand-arranged panels that follow a body's physical layout. */
const BODY_PANELS: Record<string, DevicePanel> = { xh2: xh2 as DevicePanel };

/** The hand panel for a body id such as `xh2` (also `x-h2`, `xh2-520`). */
function handPanel(body: string): DevicePanel | undefined {
  const key = body.toLowerCase().replace(/[^a-z0-9]/g, '');
  return BODY_PANELS[key] ?? Object.entries(BODY_PANELS).find(([id]) => key.startsWith(id))?.[1];
}

/**
 * Keep only what the session offers: a control whose input is missing, or a
 * cluster binding to a missing input, is dropped; layout boxes stay.
 */
function prune(nodes: readonly ControlNode[], known: ReadonlySet<string>): ControlNode[] {
  const kept: ControlNode[] = [];
  for (const node of nodes) {
    if (node.kind === 'control') {
      if (node.id && known.has(node.id)) kept.push(node);
      continue;
    }
    if (node.bindings) {
      const bindings = Object.fromEntries(
        Object.entries(node.bindings).filter(([, id]) => known.has(id)),
      );
      if (Object.keys(bindings).length === 0) continue;
      kept.push({ ...node, bindings });
      continue;
    }
    if (node.children) {
      kept.push({ ...node, children: prune(node.children, known) });
      continue;
    }
    kept.push(node);
  }
  return kept;
}

/** Build the shared panel from the native session's own input catalog. */
export function nativePanel(body: string, inputs: ControlInput[], controls: PhysicalControls): DevicePanel {
  const arranged = handPanel(body) ?? handPanel(controls.body_id);
  if (arranged) {
    const known = new Set(inputs.map((input) => input.id));
    return { ...arranged, body, layout: prune(arranged.layout, known) };
  }
  const layout = defaultLayout(inputs, controls);
  return { ...layout, body };
}
