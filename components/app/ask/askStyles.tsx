/**
 * Layout and chrome for the Ziro workspace, scoped under `.zk`.
 * Colour follows the product rule: monochrome chrome, hue only for data
 * (up/down). Three panes at 1100px+, two at 900px+, one below.
 */
export function AskStyles() {
  return (
    <style>{`
      .zk { display: grid; grid-template-columns: 232px minmax(0, 1fr) 380px; height: calc(100dvh - var(--header-h) - var(--ticker-h)); min-height: 0; }
      .zk-history { border-right: 1px solid var(--line); padding: var(--s-3); overflow-y: auto; display: flex; flex-direction: column; gap: var(--s-3); }
      .zk-history ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
      .zk-new { height: 36px; border: 1px solid var(--line-strong); border-radius: var(--r-ctl); background: var(--surface); color: var(--ink); font-weight: 600; font-size: 13px; cursor: pointer; }
      .zk-new:hover { background: var(--surface-hover); }
      .zk-session { width: 100%; text-align: left; padding: 8px 10px; border: 0; border-radius: var(--r-ctl); background: transparent; color: var(--ink-2); font-size: 13px; line-height: 18px; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .zk-session:hover { background: var(--surface-hover); color: var(--ink); }
      .zk-session[aria-current='true'] { background: var(--surface-hover); color: var(--ink); font-weight: 600; }
      .zk-quiet { margin: 0; font-size: 12px; line-height: 17px; color: var(--ink-3); }

      .zk-main { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
      .zk-thread { flex: 1; overflow-y: auto; padding: var(--s-5) var(--s-4); }
      .zk-col { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--s-5); }
      .zk-composer { border-top: 1px solid var(--line); padding: var(--s-3) var(--s-4) max(var(--s-3), env(safe-area-inset-bottom)); }
      .zk-composer form { max-width: 720px; margin: 0 auto; display: flex; gap: var(--s-2); }
      .zk-input { flex: 1; min-width: 0; height: 44px; padding: 0 14px; font-size: 16px; color: var(--ink); background: var(--surface); border: 1px solid var(--line-strong); border-radius: 22px; }
      .zk-input:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }

      .zk-canvas { border-left: 1px solid var(--line); padding: var(--s-4); overflow-y: auto; display: flex; flex-direction: column; gap: var(--s-3); background: var(--surface-sunken, var(--surface)); }

      .zk-home { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--s-4); padding-top: var(--s-6); }
      .zk-hello { margin: 0; font-size: 28px; line-height: 34px; font-weight: 600; letter-spacing: -0.02em; }
      .zk-lede { margin: 0; font-size: 14px; line-height: 20px; color: var(--ink-2); }
      .zk-eyebrow { margin: 0; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); }
      .zk-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--s-3); }
      .zk-card { border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); padding: var(--s-4); display: flex; flex-direction: column; gap: var(--s-2); }
      .zk-card[data-tone='up'] { border-left: 3px solid var(--up); }
      .zk-card[data-tone='down'] { border-left: 3px solid var(--down); }
      .zk-card-title { margin: 0; font-size: 15px; line-height: 21px; font-weight: 600; }
      .zk-card-body { margin: 0; font-size: 13px; line-height: 19px; color: var(--ink-2); }
      .zk-starters { display: flex; flex-wrap: wrap; gap: var(--s-2); }
      .zk-starter { padding: 9px 14px; border: 1px solid var(--line-strong); border-radius: 999px; background: var(--surface); color: var(--ink); font-size: 13px; cursor: pointer; text-align: left; }
      .zk-starter:hover { background: var(--surface-hover); }
      .zk-skel { height: 96px; border-radius: var(--r-card); background: var(--surface-hover); }
      .zk-facts { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
      .zk-facts li { padding: 4px 10px; border: 1px solid var(--line-strong); border-radius: 999px; font-size: 12px; color: var(--ink); }
      .zk-link { align-self: flex-start; padding: 0; border: 0; background: none; color: var(--ink-2); font-size: 12px; text-decoration: underline; cursor: pointer; }
      .zk-chats-toggle { display: none; }

      @media (max-width: 1099px) { .zk { grid-template-columns: 232px minmax(0, 1fr); } .zk-canvas { display: none; } }
      @media (max-width: 899px) {
        .zk { grid-template-columns: minmax(0, 1fr); height: calc(100dvh - var(--header-h) - var(--ticker-h) - 58px); }
        .zk-history { display: none; border-right: 0; border-bottom: 1px solid var(--line); max-height: 40dvh; }
        .zk[data-chats='open'] .zk-history { display: flex; }
        .zk-chats-toggle { display: inline-flex; margin: var(--s-2) var(--s-4) 0; align-self: flex-start; }
        .zk-hello { font-size: 24px; line-height: 30px; }
      }
    `}</style>
  );
}
