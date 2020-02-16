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
            articles: [],
            searchValue: ''
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
        }
    },
    computed: {
        containSearchValue: function() {
            let containsValueArticle = []
            let value = this.$data.searchValue.toLowerCase()
            for (let app of this.$data.articles) {
                let newApp = {
                    id: app.id,
                    title: app.title,
                    content: {}
                }
                for (let shortcut in app.content) {
                    if (app.content[shortcut].toLowerCase().includes(value)) {
                        newApp.content[shortcut] = app.content[shortcut]
                    }
                }
                if (Object.keys(newApp.content).length > 0) {
                    containsValueArticle.push(newApp)
                }
            }
            return containsValueArticle
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
        if (e.key === '/') {
            search.style.width = '15em'
            searchInput.focus()
            e.preventDefault()
        }
        if (e.key === 'Escape') {
            search.style.width = '3em'
            searchInput.blur()
        }
    })
}