// Whether a click's event path stayed entirely outside the given elements.
//
// Deliberately takes `event.composedPath()` rather than `event.target` +
// `Node.contains()`: a handler further along the same click (e.g. a v-if
// toggling an icon) can detach the actual target node before a bubble-phase
// listener on `document` gets to check it, and `contains()` on a detached
// node always reports "not contained" even if it was inside at dispatch
// time. `composedPath()` is a snapshot taken when the event was dispatched,
// so it stays correct regardless of what happens to the DOM afterwards.
export function isClickOutsideAll(
  path: readonly EventTarget[],
  elements: readonly (Element | null | undefined)[]
): boolean {
  return elements.every(el => !el || !path.includes(el));
}
