import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import Navigation from './Navigation.vue';

let wrapper: VueWrapper | undefined;

afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  document.body.innerHTML = '';
});

describe('Navigation mobile menu', () => {
  it('opens on click and stays open', async () => {
    wrapper = mount(Navigation, { attachTo: document.body });

    await wrapper.find('#mobile-menu-button').trigger('click');

    expect(wrapper.find('#mobile-menu-button').attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('#mobile-menu').exists()).toBe(true);
  });

  it('closes on a second click of the toggle button', async () => {
    wrapper = mount(Navigation, { attachTo: document.body });

    await wrapper.find('#mobile-menu-button').trigger('click');
    await wrapper.find('#mobile-menu-button').trigger('click');

    expect(wrapper.find('#mobile-menu-button').attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
  });

  it('closes when clicking outside the button and panel', async () => {
    wrapper = mount(Navigation, { attachTo: document.body });

    await wrapper.find('#mobile-menu-button').trigger('click');
    expect(wrapper.find('#mobile-menu').exists()).toBe(true);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
  });

  it('closes on Escape', async () => {
    wrapper = mount(Navigation, { attachTo: document.body });

    await wrapper.find('#mobile-menu-button').trigger('click');
    expect(wrapper.find('#mobile-menu').exists()).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
  });

  it('closes when a nav link inside the panel is clicked', async () => {
    wrapper = mount(Navigation, { attachTo: document.body });

    await wrapper.find('#mobile-menu-button').trigger('click');
    const firstLink = document.querySelector<HTMLAnchorElement>('#mobile-menu-panel a');
    expect(firstLink).not.toBeNull();

    firstLink!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#mobile-menu').exists()).toBe(false);
  });
});
