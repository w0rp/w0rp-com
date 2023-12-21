/* Public domain, created by Andrew Wray */

onDocumentReady(() => {
  /** @type {(list: string[]) => RegExp} */
  const createOrRegex = list => new RegExp('^(' + list.join('|') + ')$')

  const keywordRegex = createOrRegex([
    '[$a-zA-Z_][a-zA-Z0-9_]*',
    '[a-zA-Z_][a-zA-Z0-9_]*<.*>',
    'v:true',
    'v:false',
    'v:null',
    '@nogc',
    '@disable',
  ])
  const variableRegex = createOrRegex([
    '[glasvbwt]:[a-zA-Z0-9_]*',
  ])
  const numberRegex = /^([0-9]+|[0-9]+.[0-9]+)$/

  window.HighlightCode = {
    scan(rootElem = document.body) {
      rootElem.querySelectorAll('pre code:not(.highlight)').forEach(elem => {
        elem.classList.add('highlight')

        // Now apply the highlight after attempting to set the language.
        hljs.highlightBlock(elem)
      })

      // Look for code elements which look like keywords, and highlight them
      // with keywords.
      rootElem.querySelectorAll('code:not(.highlight)').forEach(elem => {
        const text = elem.textContent || ''
        /** @type {string | undefined} */
        let specialClass

        if (text.match(keywordRegex)) {
          specialClass = 'hljs-keyword'
        } else if (text.match(variableRegex)) {
          specialClass = 'hljs-variable'
        } else if (text.match(numberRegex)) {
          specialClass = 'hljs-number'
        }

        // Wrap text in a special span.
        if (specialClass) {
          elem.classList.add('highlight')

          const span = document.createElement('span')
          span.classList.add(specialClass)
          span.textContent = text
          elem.innerHTML = span.outerHTML
        }
      })

      rootElem.querySelectorAll('td code:not(.highlight)').forEach(elem => {
        elem.classList.add('highlight')
        hljs.highlightBlock(elem)
        elem.classList.remove('hljs')
      })

      rootElem.querySelectorAll('p code:not(.highlight)').forEach(elem => {
        elem.classList.add('highlight')
        hljs.highlightBlock(elem)
      })
    },
  }
})

onDocumentReady(() => {
  HighlightCode.scan()
})
