(function () {
    const supported = ['en', 'sw', 'fr'];
    const defaultLang = 'en';
    let translations = {};

    function getUrlLang() {
        try {
            const url = new URL(window.location.href);
            return url.searchParams.get('lang');
        } catch (e) {
            return null;
        }
    }

    function setLangParam(lang) {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.replaceState({}, '', url);
        } catch (e) {}
    }

    function applyLang(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem('site_lang', lang);
        setLangParam(lang);
    }

    function mapCountryToLang(countryCode) {
        // Simple mapping; extend as needed
        const map = {
            KE: 'sw', // Kenya -> Kiswahili
            TZ: 'sw', // Tanzania
            UG: 'sw', // Uganda (some)
            US: 'en',
            GB: 'en'
        };
        return map[countryCode] || null;
    }

    async function detectLang() {
        const urlLang = getUrlLang();
        if (urlLang && supported.includes(urlLang)) return urlLang;

        const stored = localStorage.getItem('site_lang');
        if (stored && supported.includes(stored)) return stored;

        const nav = (navigator.language || navigator.userLanguage || '').split('-')[0];
        if (nav && supported.includes(nav)) return nav;

        // Fallback: IP geolocation lookup
        try {
            const resp = await fetch('https://ipapi.co/json/');
            if (resp.ok) {
                const info = await resp.json();
                const mapped = mapCountryToLang((info.country || '').toUpperCase());
                if (mapped && supported.includes(mapped)) return mapped;
            }
        } catch (e) {
            // ignore
        }

        return defaultLang;
    }

    async function init() {
        const selector = document.getElementById('langSelector');
        if (!selector) return;

        const detected = await detectLang();
        selector.value = detected;
        await applyLang(detected);

        selector.addEventListener('change', function () {
            const v = selector.value;
            if (!supported.includes(v)) return;
            applyLang(v).then(() => {
                // reload page so server can pick up `lang` param if applicable
                window.location.reload();
            });
        });
    }

    async function loadTranslations(lang) {
        try {
            const resp = await fetch('/i18n/' + lang + '.json');
            if (!resp.ok) return {};
            return await resp.json();
        } catch (e) {
            return {};
        }
    }

    function applyTranslations(obj) {
        // replace innerText or placeholder for elements with data-i18n-key
        document.querySelectorAll('[data-i18n-key]').forEach((el) => {
            const key = el.getAttribute('data-i18n-key');
            if (!key) return;
            const value = obj[key];
            if (value === undefined) return;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.hasAttribute('placeholder')) el.setAttribute('placeholder', value);
            } else if (el.getAttribute('data-i18n-attr')) {
                // allows mapping to specific attribute, e.g., data-i18n-attr="title"
                const attr = el.getAttribute('data-i18n-attr');
                el.setAttribute(attr, value);
            } else {
                el.textContent = value;
            }
        });
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Enhance applyLang to load and apply translations
    const _applyLang = applyLang;
    applyLang = async function (lang) {
        _applyLang(lang);
        translations = await loadTranslations(lang);
        applyTranslations(translations);
    };
})();
