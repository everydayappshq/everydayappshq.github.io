(() => {
  const themeButton = document.querySelector('.theme-toggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
  let hasSavedTheme = false;
  try { hasSavedTheme = ['light', 'dark'].includes(localStorage.getItem('everyday-theme')); } catch {}

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f5f4ed' : '#111311';
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
  };
  setTheme(document.documentElement.dataset.theme);
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(theme);
    hasSavedTheme = true;
    try { localStorage.setItem('everyday-theme', theme); } catch {}
  });
  systemTheme.addEventListener('change', () => {
    if (!hasSavedTheme) setTheme(systemTheme.matches ? 'light' : 'dark');
  });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];

  const activateTab = (tab) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.getAttribute('aria-controls');
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      activateTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  });
  document.querySelector('.preview-tabs').hidden = false;

  const products = [...document.querySelectorAll('.app-card[data-platform]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const status = document.querySelector('#filter-status');
  const allCount = document.querySelector('[data-filter="all"] span');
  allCount.textContent = String(products.length).padStart(2, '0');
  document.querySelector('.nav-count').textContent = allCount.textContent;

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const platform = filter.dataset.filter;
      filters.forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
      products.forEach((product) => {
        product.hidden = platform !== 'all' && !product.dataset.platform.split(' ').includes(platform);
      });
      const count = products.filter((product) => !product.hidden).length;
      const label = platform === 'all' ? '' : ` for ${filter.textContent.trim()}`;
      status.textContent = `${count} ${count === 1 ? 'app' : 'apps'}${label}. Find your fit.`;
    });
  });
  document.querySelector('.filters').hidden = false;

  const motionButton = document.querySelector('.motion-toggle');
  const motionLabel = document.querySelector('.motion-label');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion;
  try { savedMotion = localStorage.getItem('everyday-motion'); } catch { /* Storage is optional. */ }

  const setMotion = (enabled) => {
    const active = enabled && !reducedMotion.matches;
    document.documentElement.dataset.motion = active ? 'on' : 'off';
    motionButton.setAttribute('aria-pressed', String(active));
    motionLabel.textContent = active ? 'Motion on' : 'Motion off';
    motionButton.setAttribute('aria-label', active ? 'Pause decorative animation' : 'Enable decorative animation');
    motionButton.disabled = reducedMotion.matches;
    motionButton.title = reducedMotion.matches ? 'Motion is off to respect your device preference' : '';
  };

  setMotion(savedMotion !== 'off');
  motionButton.hidden = false;
  motionButton.addEventListener('click', () => {
    const enable = document.documentElement.dataset.motion !== 'on';
    setMotion(enable);
    savedMotion = enable ? 'on' : 'off';
    try { localStorage.setItem('everyday-motion', savedMotion); } catch { /* Storage is optional. */ }
  });
  reducedMotion.addEventListener('change', () => setMotion(savedMotion !== 'off'));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
