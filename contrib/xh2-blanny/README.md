# For the xh2-blanny branch

This branch (`ILFforever/xh2-emulator`) is based on fujimod `main` and holds
only our own changes. The X-H2 board itself, including the ADC 6 / ADC 13
ladders, the 5.30 board and the X-H2 bring-up behind it, is the work of the
`xh2-blanny` contributor branch, which is not on `main`. Nothing from that
branch is republished here.

What to take into `xh2-blanny`:

1. Merge or cherry-pick the two commits on this branch. They are
   board-independent:
   - **Emulator speed:**
     - The M-profile code shadow is kept under both policies. This is a port of
       `xh2-blanny`'s own commit `c92e94f5`, which `main` does not have.
     - An opt-in `FUJIMOD_COMPANION_TICK_DIVIDER` fast mode.
   - **Emulator GUI:** an X-H2 panel laid out as on the body.
2. Apply the X-H2 board series, written against `xh2-blanny`'s tip
   (`6dd3058d`), in order:

   ```sh
   git am contrib/xh2-blanny/000*.patch
   ```

   - 0001 X-H2 5.20 on the board (boots to REC)
   - 0002 X-H2 5.33 on the board (boots to REC; one more MENU at first start)
   - 0003 Q (ADC 6), PLAY / DRIVE / VIEW (new ADC 5 ladder), Fn1 / Fn2 (GPIO
     0.4 / 0.15). Each rung's `basis` names its 5.20 key reader and scanner row.
   - 0004 Playback: SD DMA to the declared DRAM limit, the JPEG encoder and
     decoder, and the X-T5's develop/playback stubs. 5.20 then opens a camera
     JPEG from the SD slot.

Fast settings used for X-H2 testing: `FUJIMOD_SMAPH_CPU=1` and
`FUJIMOD_COMPANION_TICK_DIVIDER=32`. A 16 s boot to REC takes 49 s instead of
214 s. The divider is not hardware behavior.
