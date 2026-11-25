import type { PhysicalControls } from 'fujimod';
import type { ControlInput } from 'fujimod/emulator';
import type { DevicePanel } from '@fujimod/emulator-ui/ui/layout';
import { defaultLayout } from '@fujimod/emulator-ui/ui/default-layout';
import xh2 from './panels/xh2.json' with { type: 'json' };

/** Hand-arranged panels that follow a body's physical layout. */
const BODY_PANELS: Record<string, DevicePanel> = { xh2: xh2 as DevicePanel };

/** The hand panel for a body id such as `xh2` (also `x-h2`, `xh2-520`). */
function handPanel(body: string): DevicePanel | undefined {
  const key = body.toLowerCase().replace(/[^a-z0-9]/g, '');
  return BODY_PANELS[key] ?? Object.entries(BODY_PANELS).find(([id]) => key.startsWith(id))?.[1];
}

/** A camera screen the window does not stream, shown as a tile under the LCD. */
export interface OtherScreen {
  name: string;
  status: string;
  /** CSS aspect ratio of the real screen. */
  aspect: string;
  /** Drawn by the camera through the main output at its own size. */
  streamed?: boolean;
}

/** Size of the main LCD image; frames at any other size are the viewfinder. */
export interface MainScreen {
  width: number;
  height: number;
}

const MAIN_SCREENS: Record<string, MainScreen> = { xh2: { width: 900, height: 600 } };

/** The body's main LCD size, used to route frames by size. */
export function mainScreen(body: string): MainScreen | undefined {
  const key = body.toLowerCase().replace(/[^a-z0-9]/g, '');
  return MAIN_SCREENS[key] ?? Object.entries(MAIN_SCREENS).find(([id]) => key.startsWith(id))?.[1];
}

const OTHER_SCREENS: Record<string, OtherScreen[]> = {
  xh2: [
    { name: 'Viewfinder', status: 'Off: press VIEW MODE', aspect: '4 / 3', streamed: true },
    { name: 'Top LCD', status: 'Not emulated', aspect: '3 / 2' },
  ],
};

/** The body's other screens (for `xh2`, also `x-h2`, `xh2-520`). */
export function otherScreens(body: string): OtherScreen[] {
  const key = body.toLowerCase().replace(/[^a-z0-9]/g, '');
  return OTHER_SCREENS[key] ?? Object.entries(OTHER_SCREENS).find(([id]) => key.startsWith(id))?.[1] ?? [];
}

/**
 * Build the shared panel from the native session's own input catalog. A hand
 * panel keeps every control: one the session does not offer renders disabled
 * (greyed), so the full body layout stays visible while wiring is incomplete.
 */
export function nativePanel(body: string, inputs: ControlInput[], controls: PhysicalControls): DevicePanel {
  const arranged = handPanel(body) ?? handPanel(controls.body_id);
  if (arranged) return { ...arranged, body };
  const layout = defaultLayout(inputs, controls);
  return { ...layout, body };
}
