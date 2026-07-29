// Shared helpers for fetching and rendering content from the /api/* endpoints.
// Used by index.html (teasers), sermons.html, testimonies.html, crusade.html, charity.html, excellency.html.

window.storyCache = window.storyCache || {};

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
  const buttonsHTML = isUpcoming
    ? `<a href="index.html#give" class="btn btn-outline-dark">Support</a>
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
  // Cache the item so we can load it safely in the modal
  window.storyCache[item.id] = item;

  const meta = [item.beneficiary_name, item.location].filter(Boolean).join(' · ');
  const metaHTML = meta ? `<span class="story-meta">${meta}</span>` : '';
  const descHTML = item.description ? `<p>${item.description}</p>` : '';
  
  // Show "Read Story" button if there is a full description
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

function loadCharityStories(gridId, limit, { featured } = {}) {
  const path = featured ? '/api/charity-stories?featured=1' : '/api/charity-stories';
  return loadInto(gridId, path, charityCardHTML, { limit, type: 'charity' });
}

async function loadInto(gridId, path, renderItem, { limit, type } = {}) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    let items = await res.json();
    if (limit) items = items.slice(0, limit);
    if (!items.length) {
      grid.innerHTML = `<p style="opacity:0.7;">Nothing to show yet.</p>`;
      return;
    }
    grid.innerHTML = items.map(renderItem).join('');

    // Check if there is a story query param to open modal automatically
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('story');
    if (storyId && type) {
      const match = items.find(i => i.id == storyId);
      if (match) {
        // Wait briefly for elements to render
        setTimeout(() => openStoryModal(parseInt(storyId, 10), type, true), 100);
      }
    }
  } catch (err) {
    console.error(`Failed to load ${path}`, err);
    grid.innerHTML = `<p style="opacity:0.7;">Couldn't load this right now. Please try again shortly.</p>`;
  }
}

function loadCrusades(gridId, limit, { featured } = {}) {
  const path = featured ? '/api/crusades?featured=1' : '/api/crusades';
  return loadInto(gridId, path, crusadeCardHTML, { limit });
}

// Global popstate navigation tracking to handle back button close
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.storyId) {
    openStoryModal(e.state.storyId, e.state.type, true);
  } else {
    closeStoryModal(true);
  }
});

function loadSermons(gridId, limit, { featured } = {}) {
  const path = featured ? '/api/sermons?featured=1' : '/api/sermons';
  return loadInto(
    gridId,
    path,
    (s) => mediaCardHTML({ url: s.youtube_url, eyebrow: s.speaker ? `Sermon · ${s.speaker}` : 'Sermon', title: s.title }),
    { limit }
  );
}

function loadTestimonies(gridId, limit, { featured } = {}) {
  const path = featured ? '/api/testimonies?featured=1' : '/api/testimonies';
  return loadInto(
    gridId,
    path,
    (t) => mediaCardHTML({ url: t.youtube_url, eyebrow: 'Testimony', title: t.title }),
    { limit }
  );
}

function excellencyCardHTML(item) {
  // Cache the item so we can load it safely in the modal
  window.storyCache[item.id] = item;

  const videoId = extractYouTubeId(item.youtube_url);
  const metaHTML = item.meta ? `<span class="story-meta">${item.meta}</span>` : '';
  
  // Teaser: short description, multi-paragraph. Quote only in modal.
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

  // If no full description, click goes to YouTube
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

function loadExcellencyStories(gridId, limit, { featured } = {}) {
  const path = featured ? '/api/excellency-stories?featured=1' : '/api/excellency-stories';
  return loadInto(gridId, path, excellencyCardHTML, { limit, type: 'excellency' });
}

// Global modal overlay logic for stories
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
    if (e.target === overlay) {
      closeStoryModal();
    }
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
