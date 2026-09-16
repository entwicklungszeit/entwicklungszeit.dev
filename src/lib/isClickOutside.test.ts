import { describe, expect, it } from 'vitest';
import { isClickOutsideAll } from './isClickOutside';

describe('isClickOutsideAll', () => {
  it('is true when none of the elements are in the click path', () => {
    const button = {} as Element;
    const panel = {} as Element;
    const somethingElse = {} as EventTarget;

    expect(isClickOutsideAll([somethingElse], [button, panel])).toBe(true);
  });

  it('is false when the click path includes one of the elements', () => {
    const button = {} as Element;
    const panel = {} as Element;

    expect(isClickOutsideAll([button], [button, panel])).toBe(false);
    expect(isClickOutsideAll([panel], [button, panel])).toBe(false);
  });

  it('ignores null/undefined elements (e.g. a panel not yet in the DOM)', () => {
    const button = {} as Element;

    expect(isClickOutsideAll([button], [null, undefined])).toBe(true);
    expect(isClickOutsideAll([{} as EventTarget], [null, button])).toBe(true);
  });

  it('stays correct for a click target that was later removed from the DOM', () => {
    // This is the scenario the composedPath()-based check exists for: a
    // node that was part of the click's path but is no longer connected to
    // the document by the time it's checked. Node.contains() would report
    // "not contained" here even though the click genuinely happened inside
    // `button` — composedPath()-based membership doesn't care.
    const button = {} as Element;
    const detachedIconThatWasClicked = {} as EventTarget;

    expect(isClickOutsideAll([detachedIconThatWasClicked, button], [button, null])).toBe(false);
  });
});
