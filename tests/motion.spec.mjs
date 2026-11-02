import { test, expect } from '@playwright/test';

async function openMotion(page) {
  await page.goto('/');
  await page.waitForFunction(() => window.__particles?.snapshot().from && window['__scroll']?.lenis);
  await page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').find(e => e.name.includes('/gsap_ScrollTrigger.js?')).name;
    window.motionTriggers = (await import(url)).ScrollTrigger;
  });
}

async function jump(page, y) {
  await page.evaluate(async y => {
    window['__scroll'].scrollToY(y, { immediate: true });
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  }, y);
}

async function snapshot(page) {
  return page.evaluate(() => ({
    particles: window.__particles.snapshot(),
    logo: [...document.querySelectorAll('#experience .copy > *')].map(e => Number(getComputedStyle(e).opacity)),
    steps: [...document.querySelectorAll('[data-step]')].map(e => {
      const s = getComputedStyle(e);
      return { opacity: Number(s.opacity), transform: s.transform, top: e.getBoundingClientRect().top };
    }),
  }));
}

test('the same scroll position restores the same logo, figures and text from both directions', async ({ page }) => {
  await openMotion(page);
  const positions = await page.evaluate(() => {
    const triggers = window.motionTriggers;
    const ids = ['icvm-pair-0', 'icvm-pair-1', 'icvm-pair-2', 'icvm-pair-5', 'icvm-pair-6', 'experience-accordion'];
    return ids.flatMap(id => {
      const s = triggers.getById(id);
      return (id === 'experience-accordion' ? [.1, .5, .9, .95, .98] : [.1, .5, .9])
        .map(p => Math.round(s.start + (s.end - s.start) * p));
    });
  });
  for (const y of positions) {
    await jump(page, Math.max(0, y - 200));
    await jump(page, y);
    const down = await snapshot(page);
    await jump(page, y + 200);
    await jump(page, y);
    const up = await snapshot(page);
    expect(up.particles, `particle state at ${y}`).toEqual(down.particles);
    expect(up.logo, `logo copy at ${y}`).toEqual(down.logo);
  }
});

test('map steps reverse through the same crossfades and stop when scrolling stops', async ({ page }) => {
  await openMotion(page);
  const span = await page.evaluate(() => {
    const s = window.motionTriggers.getById('teardown-pin');
    return { start: s.start, length: s.end - s.start };
  });
  for (const time of [.01, .9, 1, 1.1, 1.9, 2, 2.1, 2.9, 3, 3.1, 4.34]) {
    const y = Math.round(span.start + span.length * time / 4.35);
    await jump(page, y - 150);
    await jump(page, y);
    const down = await snapshot(page);
    await page.waitForTimeout(130);
    expect((await snapshot(page)).steps).toEqual(down.steps);
    await jump(page, y + 150);
    await jump(page, y);
    expect((await snapshot(page)).steps, `map text at ${time}`).toEqual(down.steps);
    for (const step of down.steps) expect(step.transform).toBe('none');
    const progress = await page.evaluate(() => {
      const s = window.motionTriggers.getById('teardown-pin');
      return [s.progress, s.animation.progress()];
    });
    expect(progress[0]).toBeCloseTo(progress[1], 5);
    await page.evaluate(async () => {
      window.motionTriggers.refresh();
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    });
    expect((await snapshot(page)).steps, `map text after refresh at ${time}`).toEqual(down.steps);
  }
});

test('scene entry assigns the figure owner before emitting progress in both directions', async ({ page }) => {
  await openMotion(page);
  const calls = await page.evaluate(async () => {
    const url = performance.getEntriesByType('resource').find(e => e.name.includes('/src/shared/motion/scene.ts')).name;
    const { defineScene } = await import(url);
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;top:200px;width:1px;pointer-events:none';
    document.body.append(el);
    let active = false;
    const calls = [];
    const scene = defineScene({
      el, slots: 2, slotVh: 20,
      onToggle: value => { active = value; calls.push({ kind: 'active', active }); },
      onProgress: () => calls.push({ kind: 'progress', active }),
    });
    const updates = [];
    const { start, end } = scene.trigger;
    for (const y of [start - 20, start + 20, end + 20, end - 20, start - 20]) {
      calls.length = 0;
      window['__scroll'].scrollToY(y, { immediate: true });
      await new Promise(requestAnimationFrame);
      updates.push([...calls]);
    }
    scene.destroy();
    el.remove();
    return updates;
  });
  expect(calls.flat().filter(c => c.kind === 'active' && c.active)).toHaveLength(2);
  for (const update of calls) {
    if (update.some(c => c.kind === 'active' && c.active)) {
      expect(update[0]).toEqual({ kind: 'active', active: true });
      expect(update[1]).toEqual({ kind: 'progress', active: true });
    }
  }
});

test('revealing text stays sharp throughout its entrance', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => {
    const opacity = Number(getComputedStyle(document.querySelector('#hero-title')).opacity);
    return opacity > .05 && opacity < .95;
  });
  const samples = await page.evaluate(async () => {
    const title = document.querySelector('#hero-title');
    const samples = [];
    for (let i = 0; i < 8; i++) {
      await new Promise(requestAnimationFrame);
      const s = getComputedStyle(title);
      samples.push({ filter: s.filter, top: title.getBoundingClientRect().top });
    }
    return samples;
  });
  expect(samples.every(s => s.filter === 'none')).toBe(true);
  expect(new Set(samples.map(s => s.top)).size).toBe(1);
});

test('reduced motion keeps native scrolling and visible, unfiltered text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForFunction(() => Boolean(window['__scroll']));
  const state = await page.evaluate(() => ({
    lenis: Boolean(window['__scroll'].lenis),
    motion: document.documentElement.classList.contains('motion'),
    title: getComputedStyle(document.querySelector('#hero-title')).opacity,
    filter: getComputedStyle(document.querySelector('#hero-title')).filter,
    pin: document.querySelector('[data-pin]').style.position,
  }));
  expect(state).toEqual({ lenis: false, motion: false, title: '1', filter: 'none', pin: '' });
});
