Reveal.initialize({
  width: 1152,
  height: 864,
  margin: 0.1,
  minScale: 0.1,
  maxScale: 1.0,
  transition: 'convex',
})

// Keep track of which slide we are on for refreshing the window.
document.body.addEventListener('slidechanged', () => {
  const state = Reveal.getState()

  window.location.hash = '#/' + state.indexh + '/' + state.indexv
})
