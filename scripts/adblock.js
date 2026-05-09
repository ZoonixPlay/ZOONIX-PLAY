/* ================================================================
   ZONIX PLAY — adblock.js
   Carregue este script no <head> ANTES de qualquer outro script.
   ================================================================ */

(function() {
    'use strict';

    /* -------------------------------------------------------
       1. BLOQUEIA window.open — impede abertura de nova aba
       ------------------------------------------------------- */
    window.open = function() { return null; };

    /* -------------------------------------------------------
       2. BLOQUEIA location.href e location.replace
          usados para redirecionar a página inteira
       ------------------------------------------------------- */
    const _loc = window.location;

    try {
        Object.defineProperty(window, 'location', {
            get: function() { return _loc; },
            set: function(v) {
                /* Permite navegação interna (mesma origem) */
                try {
                    const url = new URL(v, location.href);
                    if (url.origin === location.origin) {
                        _loc.href = v;
                    }
                    /* Ignora redirecionamentos externos silenciosamente */
                } catch(e) {}
            }
        });
    } catch(e) {}

    /* -------------------------------------------------------
       3. BLOQUEIA history.pushState / replaceState externos
       ------------------------------------------------------- */
    const _pushState    = history.pushState.bind(history);
    const _replaceState = history.replaceState.bind(history);

    history.pushState = function(state, title, url) {
        if (!url || String(url).startsWith('/') || String(url).startsWith(location.origin)) {
            return _pushState(state, title, url);
        }
    };
    history.replaceState = function(state, title, url) {
        if (!url || String(url).startsWith('/') || String(url).startsWith(location.origin)) {
            return _replaceState(state, title, url);
        }
    };

    /* -------------------------------------------------------
       4. BLOQUEIA document.write — técnica clássica de ad inject
       ------------------------------------------------------- */
    document.write    = function() {};
    document.writeln  = function() {};

    /* -------------------------------------------------------
       5. BLOQUEIA criação de iframes / scripts / links de anúncio
          via document.createElement interceptado
       ------------------------------------------------------- */
    const AD_DOMAINS = [
        "doubleclick","googlesyndication","adnxs","popads","popcash",
        "exoclick","trafficjunky","hilltopads","propellerads","adcash",
        "monetizer","juicyads","adsterra","clickadu","bidvertiser",
        "revcontent","outbrain","taboola","adform","smartadserver",
        "rubiconproject","openx","pubmatic","appnexus","adskeeper",
        "yllix","plugrush","adspyglass","trafficshop","admaven",
        "popmyads","adpop","popunder","popupunder"
    ];

    const _createElement = document.createElement.bind(document);
    document.createElement = function(tag) {
        const el = _createElement(tag);
        const t  = tag.toLowerCase();

        /* Iframes extras → bloqueia src externo */
        if (t === 'iframe') {
            const _setSrc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src') ||
                            Object.getOwnPropertyDescriptor(Element.prototype, 'src');
            Object.defineProperty(el, 'src', {
                set: function(v) {
                    try {
                        const url = new URL(v, location.href);
                        if (url.origin !== location.origin && el.id !== 'main-player') {
                            return; /* Ignora */
                        }
                    } catch(e) {}
                    el.setAttribute('src', v);
                },
                get: function() { return el.getAttribute('src') || ''; }
            });
        }

        /* Scripts → bloqueia domínios de anúncio */
        if (t === 'script') {
            Object.defineProperty(el, 'src', {
                set: function(v) {
                    if (AD_DOMAINS.some(d => String(v).includes(d))) return;
                    el.setAttribute('src', v);
                },
                get: function() { return el.getAttribute('src') || ''; }
            });
        }

        /* Links <a> externos criados por JS → bloqueia click */
        if (t === 'a') {
            el.addEventListener('click', function(e) {
                const href = this.getAttribute('href') || '';
                if (href && !href.startsWith('#') && !href.startsWith('javascript')) {
                    try {
                        const url = new URL(href, location.href);
                        if (url.origin !== location.origin && !this.hasAttribute('data-safe-link')) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }
                    } catch(ex) {}
                }
            }, true);
        }

        return el;
    };

    /* -------------------------------------------------------
       6. MUTATION OBSERVER — remove nós injetados dinamicamente
       ------------------------------------------------------- */
    function removeAdNode(node) {
        if (!node || !node.tagName) return;
        const tag = node.tagName.toLowerCase();
        const src = node.src || node.href || '';

        /* Iframes que não sejam o player legítimo */
        if (tag === 'iframe' && node.id !== 'main-player') {
            node.remove(); return;
        }

        /* Scripts de domínios de anúncio */
        if ((tag === 'script' || tag === 'link') && AD_DOMAINS.some(d => src.includes(d))) {
            node.remove(); return;
        }

        /* Divs/spans com z-index altíssimo (overlay de anúncio) */
        if (['div','span','section','aside'].includes(tag)) {
            const z = parseInt(window.getComputedStyle(node).zIndex, 10);
            if (z > 2147483000) { node.remove(); return; }
        }
    }

    const adObserver = new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(removeAdNode));
    });

    /* Inicia observer assim que o body existir */
    if (document.body) {
        adObserver.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            adObserver.observe(document.body, { childList: true, subtree: true });
        });
    }

    /* -------------------------------------------------------
       7. BLOQUEIA beforeunload não solicitado
          (redirecionar a aba ao sair)
       ------------------------------------------------------- */
    window._userNavigation = false;

    window.addEventListener('beforeunload', function(e) {
        if (!window._userNavigation) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });

    /* Marca links e botões legítimos para não bloquear */
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('[data-safe-link], .btn-canal, .btn-nav, .link-doar')
            .forEach(el => el.addEventListener('click', () => { window._userNavigation = true; }));
    });

    /* -------------------------------------------------------
       8. BLOQUEIA perda de foco (popup ao clicar na página)
       ------------------------------------------------------- */
    let _blurLock = false;

    window.addEventListener('blur', function() {
        if (_blurLock) return;
        _blurLock = true;
        setTimeout(() => {
            window.focus();
            _blurLock = false;
        }, 50);
    });

    /* -------------------------------------------------------
       9. BLOQUEIA mouseleave / mouseout usados para popup
          (popup ao mover o mouse para fora da tela)
       ------------------------------------------------------- */
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 || e.clientX <= 0 ||
            e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true);

    console.info('[ZONIX ADBLOCK] Ativo ✓');

})();
