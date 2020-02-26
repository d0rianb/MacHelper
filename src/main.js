const keySymbols = {
    'cmd': '⌘',
    'alt': '⌥',
    'ctrl': '⌃',
    'maj': '⇧',
    'majLock': '⇪',
    'tab': '⇥',
    'backspace': '⌫',
    'esc': '⎋',
    'fn': 'fn',
    'space': 'Space',
    'rightArrow': '→',
    'leftArrow': '←',
    'upArrow': '↑',
    'downArrow': '↓',
    'anyArrow': '→, ←, ↑, ↓'
}

const keyLabels = {
    'cmd': 'Command',
    'alt': 'Option',
    'ctrl': 'Control',
    'maj': 'Shift',
    'majLock': 'Caps lock',
    'tab': 'Tab',
    'backspace': 'Delete',
    'esc': 'Escape',
    'fn': 'Function',
    'space': 'Space',
    'rightArrow': 'Arrow Right',
    'leftArrow': 'Arrow Left',
    'upArrow': 'Arrow Up',
    'downArrow': 'Arrow Down',
    'anyArrow': 'Any Arrow'
}

const hintsArray = [
    'Vous pouvez faire une recherche par racourci clavier en la tappant dans la barre de recherche',
    "La barre de recherche est dynamique"
]

let app = new Vue({
    el: '#app',
    created: function() {
        document.title = this.$data.appName
    },
    mounted: function() {
        this.generateArticles()
    },
    filters: {
        toKey: function(text, label = false) {
            let string = ''
            text.split('-').forEach(char => {
                let printableChar = char.toUpperCase()
                if (keySymbols[char]) {
                    printableChar = keySymbols[char]
                }
                if (keyLabels[char] && label) {
                    printableChar += ' ' + keyLabels[char]
                }
                string += `<kbd data-raw="${char}">${printableChar}</kbd> `
            })
            return string
        }
    },
    data: function() {
        return {
            appName: 'MacHelper',
            searchInputActive: false,
            articles: [],
            searchValue: '',
            searchModifiers: '',
            hints: hintsArray
        }
    },
    methods: {
        generateArticles: async function() {
            let articles = []
            await fetch('https://d0rianb.github.io/MacHelper/ressources/articles/shortcuts.json')
                .then(data => data.json())
                .then(json => {
                    for (let app in json) {
                        articles.push({
                            id: articles.length,
                            title: app,
                            content: json[app]
                        })
                    }
                })
            this.$set(this.$data, 'articles', articles)
        },
        onFocus: function(e) {
            this.searchInputActive = true
        },
        onBlur() {
            this.searchInputActive = false
        }

    },
    computed: {
        containSearchValue: function() {
            let containsValueArticle = []
            let value = this.searchValue.toLowerCase()
            let modifiers = this.searchModifiers
            for (let app of this.$data.articles) {
                let newApp = {
                    id: app.id,
                    title: app.title,
                    content: {}
                }
                for (let shortcut in app.content) {
                    if (app.content[shortcut].toLowerCase().includes(value) && shortcut.includes(modifiers)) {
                        newApp.content[shortcut] = app.content[shortcut]
                    }
                }
                if (Object.keys(newApp.content).length > 0) {
                    containsValueArticle.push(newApp)
                }
            }
            return containsValueArticle
        },
        hint: function() {
            let index = Math.round(Math.random() * (this.hints.length - 1))
            return this.hints[index]
        }
    }
})

window.onload = () => {
    const tooltip = document.querySelector('.tooltip-key')
    const search = document.querySelector('.search')
    const searchBtn = document.querySelector('.search > i')
    const searchInput = document.querySelector('.search > input')
    window.addEventListener('mousemove', e => {
        let x = e.clientX,
            y = e.clientY
        if (!tooltip) return
        if (e.target.localName === 'kbd') {
            let rawText = e.target.getAttribute('data-raw')
            if (keyLabels[rawText]) {
                tooltip.innerText = keyLabels[rawText]
            } else {
                tooltip.innerText = rawText.toUpperCase()
            }
            tooltip.style.display = 'block'
            tooltip.style.top = (window.scrollY + y + 12) + 'px'
            tooltip.style.left = (window.scrollX + x + 10) + 'px'

        } else {
            tooltip.style.display = 'none'
        }
    })
    searchBtn.addEventListener('click', e => {
        search.style.width = '15em'
        searchInput.focus()
    })
    window.addEventListener('keydown', e => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            search.style.width = '15em'
            searchInput.focus()
            e.preventDefault()
        }
        if (e.key === 'Escape') {
            search.style.width = '3em'
            searchInput.blur()
        }
        if (app.$data.searchInputActive) {
            let modifiers = []
            let cmd = e.metaKey
            let ctrl = e.ctrlKey
            let alt = e.altKey
            let shift = e.shiftKey
            cmd ? modifiers.push('cmd') : null
            ctrl ? modifiers.push('ctrl') : null
            alt ? modifiers.push('alt') : null
            shift ? modifiers.push('maj') : null
            if (modifiers.length > 0) {
                let modifiersString = modifiers.join('-')
                app.$set(app.$data, 'searchModifiers', modifiersString)
            }
        }
    })
    window.addEventListener('keyup', e => {
        if (app.$data.searchInputActive) {
            app.$set(app.$data, 'searchModifiers', '')
        }
    })
}