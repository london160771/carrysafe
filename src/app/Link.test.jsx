import { afterEach, describe, expect, it, vi } from 'vitest';
import Link from './Link.jsx';

function click(element, overrides = {}) {
  const event = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, preventDefault: vi.fn(), ...overrides };
  element.props.onClick(event);
  return event;
}

describe('Link', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('runs the caller onClick and still navigates without a page reload', () => {
    const pushState = vi.fn();
    vi.stubGlobal('window', { location: { pathname: '/' }, history: { pushState }, scrollTo: vi.fn() });
    vi.stubGlobal('document', { getElementById: () => null });
    const onClick = vi.fn();
    const event = click(Link({ to: '/privacy', onClick, children: 'Privacy' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(pushState).toHaveBeenCalledWith(null, '', '/privacy');
  });

  it('leaves modified clicks to the browser', () => {
    const event = click(Link({ to: '/privacy', children: 'Privacy' }), { metaKey: true });
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
