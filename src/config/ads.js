// Central ad configuration. Each placement can be toggled independently.
// `provider` stays null until an ad network is integrated; until then each
// enabled slot renders a reserved, labeled placeholder of the right size.
export const adConfig = {
  provider: null,
  placements: {
    'home-top': { enabled: false, minHeight: { mobile: 100, desktop: 90 }, maxWidth: 728 },
    'home-feed': { enabled: true, minHeight: { mobile: 250, desktop: 90 }, maxWidth: 728, afterSection: 3 },
    'article-sidebar': { enabled: true, minHeight: { mobile: 250, desktop: 250 }, maxWidth: 300, desktopOnly: true },
    'in-article': { enabled: true, minHeight: { mobile: 250, desktop: 250 }, maxWidth: 336, minParagraphs: 6 },
  },
  // Floating placements, in priority order. At most one is shown at a time:
  // the first enabled one whose viewport range matches and whose scroll rule is met.
  floating: [
    { id: 'edge-rail', enabled: true, minViewport: 1480, maxViewport: Infinity, width: 120, height: 600, showAfterScroll: 0 },
    { id: 'corner-card', enabled: true, minViewport: 768, maxViewport: 1479, width: 300, height: 100, showAfterScroll: 600 },
    { id: 'mobile-bottom', enabled: true, minViewport: 0, maxViewport: 767, width: null, height: 60, showAfterScroll: 400 },
  ],
}

export const getPlacement = (id) => {
  const placement = adConfig.placements[id]
  return placement?.enabled ? placement : null
}

// Splits article HTML after a middle top-level paragraph so an ad can sit between paragraphs.
export const splitForInArticleAd = (html = '') => {
  const config = getPlacement('in-article')
  if (!config || typeof DOMParser === 'undefined') return [html, '']
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const nodes = [...doc.body.childNodes]
  const paragraphs = nodes.filter((node) => node.nodeName === 'P')
  if (paragraphs.length < config.minParagraphs) return [html, '']
  const index = nodes.indexOf(paragraphs[Math.max(3, Math.floor(paragraphs.length / 2)) - 1])
  const toHtml = (list) => { const box = doc.createElement('div'); list.forEach((node) => box.appendChild(node.cloneNode(true))); return box.innerHTML }
  return [toHtml(nodes.slice(0, index + 1)), toHtml(nodes.slice(index + 1))]
}
