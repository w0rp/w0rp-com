/* Public domain, created by Andrew Wray */

/** @type {(fn: () => void) => void} */
// eslint-disable-next-line
const onDocumentReady = fn => {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

onDocumentReady(() => {
  // Add a class so CSS can do different things when JS is on.
  document.body.classList.add('js')

  const verifyElem = document.getElementById('id_' + 'verify')

  if (verifyElem instanceof HTMLInputElement) {
    verifyElem.value = '' + (347 * 347)
  }
})
