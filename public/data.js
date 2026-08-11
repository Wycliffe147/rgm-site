// Shared helpers for fetching and rendering content from the /api/* endpoints.
// Used by index.html (teasers), sermons.html, testimonies.html, crusade.html, charity.html, excellency.html.

window.storyCache = window.storyCache || {};

const DEFAULT_PAGE_SIZE = 6;

function extractYouTubeId(url) {
  const match = (url || '').match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{6,})/);
  return match ? match[1] : '';
}

function isCharityPage() {
  return window.location.pathname.includes('charity.html');
}

function isExcellencyPage() {
  return window.location.pathname.includes('excellency.html');
}

// ─── Skeleton card generators ─────────────────────────────────────────────────
function skelMediaCard() {
  return `<div class="skeleton-card skeleton-media-card">
    <div class="skel skel-thumb"></div>
    <div class="skel-body">
      <div class="skel skel-eyebrow"></div>
      <div class="skel skel-title"></div>
      <div class="skel skel-line"></div>
    </div>
  </div>`;
}

function skelStoryCard() {
  return `<div class="skeleton-card skeleton-story-card">
    <div class="skel skel-thumb"></div>
    <div class="skel-body">
      <div class="skel skel-eyebrow"></div>
      <div class="skel skel-title"></div>
      <div class="skel skel-text"></div>
      <div class="skel skel-line"></div>
    </div>
  </div>`;
}

function skelCrusadeCard() {
  return `<div class="skeleton-card skeleton-crusade-card">
    <div class="skel skel-poster"></div>
    <div class="skel-body">
      <div class="skel skel-date"></div>
      <div class="skel skel-title"></div>
      <div class="skel skel-text"></div>
      <div class="skel skel-line"></div>
      <div class="skel skel-btn"></div>
    </div>
  </div>`;
}

function renderSkeletons(grid, skeletonType, count) {
  const fn = skeletonType === 'crusade' ? skelCrusadeCard
           : skeletonType === 'story'   ? skelStoryCard
           : skelMediaCard;
  grid.innerHTML = Array.from({ length: count }, fn).join('');
}

// ─── Card HTML templates ──────────────────────────────────────────────────────
function mediaCardHTML({ url, eyebrow, title }) {
  const videoId = extractYouTubeId(url);
  return `
    <a class="media-card" href="${url}" target="_blank" rel="noopener">
      <div class="media-thumb" style="background:none;">
        <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${title} thumbnail" class="thumb-img">
        <div class="play-btn">▶</div>
      </div>
      <div class="body">
        <div class="eyebrow">${eyebrow}</div>
        <h3>${title}</h3>
      </div>
    </a>`;
}

function crusadeCardHTML(c) {
  const isUpcoming = c.status === 'upcoming';
  const badgeLabel = isUpcoming ? 'Upcoming' : 'Past';
  const giveHref = 'give.html';
  const buttonsHTML = isUpcoming
    ? `<a href="${giveHref}" class="btn btn-outline-dark">Support</a>
       <a href="crusade.html?slug=${c.slug}" class="btn btn-outline-dark">See Details</a>`
    : `<a href="crusade.html?slug=${c.slug}" class="btn btn-outline-dark">See Highlights &amp; More</a>`;

  return `
    <div class="crusade-card">
      <div class="crusade-poster">
        <img src="${c.poster_url || ''}" alt="${c.title} poster" class="poster-img" onerror="this.style.display='none'">
        <span class="crusade-badge ${isUpcoming ? 'upcoming' : 'past'}">${badgeLabel}</span>
      </div>
      <div class="crusade-body">
        <div class="crusade-date">${c.date_range || ''}</div>
        <h3>${c.title}</h3>
        <p>${c.description || ''}</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
          ${buttonsHTML}
        </div>
      </div>
    </div>`;
}

function charityCardHTML(item) {
  window.storyCache[item.id] = item;

  const meta = [item.beneficiary_name, item.location].filter(Boolean).join(' · ');
  const metaHTML = meta ? `<span class="story-meta">${meta}</span>` : '';
  const descHTML = item.description ? `<p>${item.description}</p>` : '';

  let readMoreHTML = '';
  if (item.full_description) {
    if (isCharityPage()) {
      readMoreHTML = `<span class="btn btn-outline-dark btn-sm" role="button" tabindex="0" onclick="event.preventDefault(); event.stopPropagation(); openStoryModal(${item.id}, 'charity')" style="margin-top:12px; padding: 6px 14px; font-size: 0.8rem; background:transparent; cursor:pointer;">Read Full Story</span>`;
    } else {
      readMoreHTML = `<span class="btn btn-outline-dark btn-sm" role="button" tabindex="0" onclick="event.preventDefault(); event.stopPropagation(); location.href='charity.html?story=${item.id}'" style="margin-top:12px; padding: 6px 14px; font-size: 0.8rem; background:transparent; cursor:pointer;">Read Full Story</span>`;
    }
  }

  if (item.youtube_url) {
    const videoId = extractYouTubeId(item.youtube_url);
    return `
      <a class="story-card" href="${item.youtube_url}" target="_blank" rel="noopener">
        <div class="story-thumb">
          <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${item.title} thumbnail" class="thumb-img">
          <div class="play-btn">▶</div>
        </div>
        <div class="body">
          ${metaHTML}
          <h3>${item.title}</h3>
          ${descHTML}
          ${readMoreHTML}
        </div>
      </a>`;
  }

  return `
    <div class="story-card no-link">
      <div class="story-thumb">
        ${item.photo_url ? `<img src="${item.photo_url}" alt="${item.title} photo" class="thumb-img">` : ''}
      </div>
      <div class="body">
        ${metaHTML}
        <h3>${item.title}</h3>
        ${descHTML}
        ${readMoreHTML}
      </div>
    </div>`;
}

function excellencyCardHTML(item) {
  window.storyCache[item.id] = item;

  const videoId = extractYouTubeId(item.youtube_url);
  const metaHTML = item.meta ? `<span class="story-meta">${item.meta}</span>` : '';

  const paragraphs = (item.description || '').split('\n\n').filter(Boolean);
  const descHTML = paragraphs.map((p, idx) => {
    const style = idx > 0 ? ' style="margin-top:10px;"' : '';
    return `<p${style}>${p}</p>`;
  }).join('');

  if (item.full_description) {
    const clickHandler = isExcellencyPage()
      ? `openStoryModal(${item.id}, 'excellency')`
      : `location.href='excellency.html?story=${item.id}'`;

    return `
      <div class="story-card" style="cursor:pointer;" onclick="${clickHandler}">
        <div class="story-thumb">
          <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${item.title} video thumbnail" class="thumb-img">
          <div class="play-btn">▶</div>
        </div>
        <div class="body">
          ${metaHTML}
          <h3>${item.title}</h3>
          ${descHTML}
          <span class="btn btn-outline-dark btn-sm" role="button" tabindex="0" style="margin-top:12px; padding: 6px 14px; font-size: 0.8rem; background:transparent;">Read Full Story</span>
        </div>
      </div>`;
  }

  return `
    <a class="story-card" href="${item.youtube_url}" target="_blank" rel="noopener">
      <div class="story-thumb">
        <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${item.title} video thumbnail" class="thumb-img">
        <div class="play-btn">▶</div>
      </div>
      <div class="body">
        ${metaHTML}
        <h3>${item.title}</h3>
        ${descHTML}
      </div>
    </a>`;
}

// ─── Core loader ──────────────────────────────────────────────────────────────
async function loadInto(gridId, path, renderItem, { limit, type, pageSize, skeletonType = 'media' } = {}) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  // 1. Show skeleton placeholders immediately — no blank grids
  renderSkeletons(grid, skeletonType, pageSize || 3);

  // Remove any stale Load More wrapper from a previous call
  const prevLM = document.getElementById(`lm_${gridId}`);
  if (prevLM) prevLM.remove();

  try {
    // Build URL — add server-side pagination params when a pageSize is specified
    const fetchUrl = new URL(path, window.location.origin);
    if (pageSize) {
      fetchUrl.searchParams.set('limit', pageSize);
      fetchUrl.searchParams.set('offset', '0');
    }

    const res = await fetch(fetchUrl.toString());
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    let items = await res.json();
    if (limit) items = items.slice(0, limit);

    if (!items.length) {
      grid.innerHTML = `<p style="opacity:0.7;">Nothing to show yet.</p>`;
      return;
    }

    // 2. Swap skeletons for real cards
    grid.innerHTML = items.map(renderItem).join('');

    // 3. Attach "Load More" if we received a full page (there may be more)
    if (pageSize && items.length >= pageSize) {
      let offset = pageSize;

      const lmWrap = document.createElement('div');
      lmWrap.className = 'load-more-wrap';
      lmWrap.id = `lm_${gridId}`;
      lmWrap.innerHTML = `<button class="btn btn-outline load-more-btn">Load More</button>`;
      grid.parentNode.insertBefore(lmWrap, grid.nextSibling);

      lmWrap.querySelector('button').addEventListener('click', async () => {
        const btn = lmWrap.querySelector('button');
        btn.textContent = 'Loading…';
        btn.disabled = true;

        // Show mini skeleton rows at the bottom while fetching
        const skelFn = skeletonType === 'crusade' ? skelCrusadeCard
                     : skeletonType === 'story'   ? skelStoryCard
                     : skelMediaCard;
        grid.insertAdjacentHTML('beforeend', Array.from({ length: 3 }, skelFn).join(''));

        try {
          const moreUrl = new URL(path, window.location.origin);
          moreUrl.searchParams.set('limit', pageSize);
          moreUrl.searchParams.set('offset', offset);
          const moreRes = await fetch(moreUrl.toString());
          const moreItems = await moreRes.json();

          // Remove inline skeletons then append real cards
          grid.querySelectorAll('.skeleton-card').forEach(s => s.remove());
          grid.insertAdjacentHTML('beforeend', moreItems.map(renderItem).join(''));
          offset += moreItems.length;

          if (moreItems.length < pageSize) {
            lmWrap.remove(); // No further pages
          } else {
            btn.textContent = 'Load More';
            btn.disabled = false;
          }
        } catch {
          grid.querySelectorAll('.skeleton-card').forEach(s => s.remove());
          btn.textContent = 'Failed. Try again.';
          btn.disabled = false;
        }
      });
    }

    // 4. Auto-open story modal when ?story= is in the URL (deep-link support)
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('story');
    if (storyId && type) {
      const match = items.find(i => i.id == storyId);
      if (match) {
        setTimeout(() => openStoryModal(parseInt(storyId, 10), type, true), 100);
      }
    }
  } catch (err) {
    console.error(`Failed to load ${path}`, err);
    grid.innerHTML = `<p style="opacity:0.7;">Couldn't load this right now. Please try again shortly.</p>`;
  }
}

// ─── Content-type loaders ─────────────────────────────────────────────────────
function loadCrusades(gridId, limit, { featured, search } = {}) {
  const base = featured ? '/api/crusades?featured=1' : '/api/crusades';
  const path = (search && !featured) ? `${base}?search=${encodeURIComponent(search)}` : base;
  return loadInto(gridId, path, crusadeCardHTML, {
    limit,
    skeletonType: 'crusade',
    // Disable pagination when searching so all matches are visible
    pageSize: (featured || search) ? null : DEFAULT_PAGE_SIZE
  });
}

function loadSermons(gridId, limit, { featured, search } = {}) {
  const base = featured ? '/api/sermons?featured=1' : '/api/sermons';
  const path = (search && !featured) ? `${base}?search=${encodeURIComponent(search)}` : base;
  return loadInto(
    gridId, path,
    (s) => mediaCardHTML({ url: s.youtube_url, eyebrow: s.speaker ? `Sermon · ${s.speaker}` : 'Sermon', title: s.title }),
    { limit, skeletonType: 'media', pageSize: (featured || search) ? null : DEFAULT_PAGE_SIZE }
  );
}

function loadTestimonies(gridId, limit, { featured, search } = {}) {
  const base = featured ? '/api/testimonies?featured=1' : '/api/testimonies';
  const path = (search && !featured) ? `${base}?search=${encodeURIComponent(search)}` : base;
  return loadInto(
    gridId, path,
    (t) => mediaCardHTML({ url: t.youtube_url, eyebrow: 'Testimony', title: t.title }),
    { limit, skeletonType: 'media', pageSize: (featured || search) ? null : DEFAULT_PAGE_SIZE }
  );
}

function loadCharityStories(gridId, limit, { featured, search } = {}) {
  const base = featured ? '/api/charity-stories?featured=1' : '/api/charity-stories';
  const path = (search && !featured) ? `${base}?search=${encodeURIComponent(search)}` : base;
  return loadInto(gridId, path, charityCardHTML, {
    limit, type: 'charity', skeletonType: 'story',
    pageSize: (featured || search) ? null : DEFAULT_PAGE_SIZE
  });
}

function loadExcellencyStories(gridId, limit, { featured, search } = {}) {
  const base = featured ? '/api/excellency-stories?featured=1' : '/api/excellency-stories';
  const path = (search && !featured) ? `${base}?search=${encodeURIComponent(search)}` : base;
  return loadInto(gridId, path, excellencyCardHTML, {
    limit, type: 'excellency', skeletonType: 'story',
    pageSize: (featured || search) ? null : DEFAULT_PAGE_SIZE
  });
}

// ─── Search helper ────────────────────────────────────────────────────────────
// Wire a search <input> to a loader function with 350ms debounce.
// Usage: setupSearch('myInputId', q => loadSermons('sermonsGrid', null, { search: q }));
function setupSearch(inputId, loaderFn) {
  const el = document.getElementById(inputId);
  if (!el) return;
  let timer;
  el.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => loaderFn(el.value.trim()), 350);
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { clearTimeout(timer); loaderFn(el.value.trim()); }
  });
}

// ─── Back-button / popstate handling ─────────────────────────────────────────
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.storyId) {
    openStoryModal(e.state.storyId, e.state.type, true);
  } else {
    closeStoryModal(true);
  }
});

// ─── Story modal ──────────────────────────────────────────────────────────────
function openStoryModal(id, type, preventHistoryPush) {
  const item = window.storyCache[id];
  if (!item) return;

  let overlay = document.getElementById('storyModalOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'storyModalOverlay';
    overlay.className = 'story-modal-overlay';
    document.body.appendChild(overlay);
  }

  const metaLabel = type === 'charity'
    ? [item.beneficiary_name, item.location].filter(Boolean).join(' · ')
    : (item.meta || '');

  let mediaHTML = '';
  if (item.youtube_url) {
    const videoId = extractYouTubeId(item.youtube_url);
    mediaHTML = `
      <div class="story-modal-hero">
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>`;
  } else if (item.photo_url) {
    mediaHTML = `
      <div class="story-modal-hero">
        <img src="${item.photo_url}" alt="${item.title}">
      </div>`;
  }

  const quoteHTML = item.quote ? `<div class="story-modal-quote">${item.quote}</div>` : '';

  const narrative = item.full_description || item.description || '';
  const textHTML = narrative
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p}</p>`)
    .join('');

  overlay.innerHTML = `
    <div class="story-modal-box">
      <button class="story-modal-close" onclick="closeStoryModal()">×</button>
      ${mediaHTML}
      <div class="story-modal-body">
        <span class="story-modal-meta">${metaLabel}</span>
        <h2>${item.title}</h2>
        ${quoteHTML}
        <div class="story-modal-text">${textHTML}</div>
      </div>
    </div>
  `;

  document.body.style.overflow = 'hidden';
  overlay.classList.add('open');

  if (!preventHistoryPush) {
    history.pushState({ storyId: id, type: type }, '', `?story=${id}`);
  }

  overlay.onclick = function(e) {
    if (e.target === overlay) closeStoryModal();
  };
}

function closeStoryModal(preventHistoryBack) {
  const overlay = document.getElementById('storyModalOverlay');
  if (overlay) {
    const iframe = overlay.querySelector('iframe');
    if (iframe) iframe.src = '';
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (!preventHistoryBack && window.location.search.includes('story=')) {
      history.pushState(null, '', window.location.pathname);
    }
  }
}
