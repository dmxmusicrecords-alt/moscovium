(function () {
    const baseCurrency = 'USD';
    const supportedCurrencies = ['USD', 'KES', 'TZS', 'UGX', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'RUB', 'BRL', 'MXN', 'NGN', 'ZAR', 'CNY'];
    const countryCurrencyMap = {
        KE: 'KES', // Kenya
        TZ: 'TZS', // Tanzania
        UG: 'UGX', // Uganda
        GB: 'GBP', // United Kingdom
        FR: 'EUR', // France
        DE: 'EUR', // Germany
        ES: 'EUR', // Spain
        IT: 'EUR', // Italy
        NL: 'EUR', // Netherlands
        CA: 'CAD', // Canada
        AU: 'AUD', // Australia
        NZ: 'NZD', // New Zealand
        JP: 'JPY', // Japan
        IN: 'INR', // India
        RU: 'RUB', // Russia
        BR: 'BRL', // Brazil
        MX: 'MXN', // Mexico
        NG: 'NGN', // Nigeria
        ZA: 'ZAR', // South Africa
        CN: 'CNY', // China
        US: 'USD'
    };
    const currencyLocaleMap = {
        USD: 'en-US',
        KES: 'en-KE',
        TZS: 'en-TZ',
        UGX: 'en-UG',
        EUR: 'fr-FR',
        GBP: 'en-GB',
        CAD: 'en-CA',
        AUD: 'en-AU',
        NZD: 'en-NZ',
        JPY: 'ja-JP',
        INR: 'en-IN',
        RUB: 'ru-RU',
        BRL: 'pt-BR',
        MXN: 'es-MX',
        NGN: 'en-NG',
        ZAR: 'en-ZA',
        CNY: 'zh-CN'
    };
    const pricePattern = /USD\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?)/g;
    const formattedCache = new Map();
    const trackedPriceNodes = [];
    const currencyDisplayNames = typeof Intl.DisplayNames === 'function'
        ? new Intl.DisplayNames(['en-US'], { type: 'currency' })
        : null;

    function getUrlParam(name) {
        try {
            const url = new URL(window.location.href);
            return url.searchParams.get(name);
        } catch (e) {
            return null;
        }
    }

    function getCountryFromLocale(locale) {
        if (!locale) return null;
        const parts = locale.toUpperCase().split(/[-_]/);
        return parts[1] || null;
    }

    function mapLocaleToCurrency(locale) {
        const country = getCountryFromLocale(locale);
        if (country && countryCurrencyMap[country]) {
            return countryCurrencyMap[country];
        }

        const language = (locale || '').split('-')[0].toLowerCase();
        if (language === 'sw') return 'KES';
        if (language === 'fr') return 'EUR';
        return 'USD';
    }

    async function getCountryFromIp() {
        try {
            const resp = await fetch('https://ipapi.co/json/');
            if (!resp.ok) return null;
            const info = await resp.json();
            return (info.country || null);
        } catch (e) {
            return null;
        }
    }

    async function detectCurrency() {
        const urlCurrency = getUrlParam('currency');
        if (urlCurrency && supportedCurrencies.includes(urlCurrency.toUpperCase())) {
            return urlCurrency.toUpperCase();
        }

        const stored = localStorage.getItem('site_currency');
        if (stored && supportedCurrencies.includes(stored)) {
            return stored;
        }

        const navLocale = (navigator.languages && navigator.languages.length ? navigator.languages[0] : null) || navigator.language || navigator.userLanguage || 'en-US';
        const mapped = mapLocaleToCurrency(navLocale);
        if (mapped) return mapped;

        const country = await getCountryFromIp();
        if (country) {
            const geoCurrency = countryCurrencyMap[country.toUpperCase()];
            if (geoCurrency) return geoCurrency;
        }

        return baseCurrency;
    }

    function formatCurrency(value, currency, locale) {
        if (!currency || currency === baseCurrency) {
            return new Intl.NumberFormat(locale, { style: 'currency', currency: baseCurrency }).format(value);
        }

        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
    }

    async function fetchRates(targetCurrency) {
        if (targetCurrency === baseCurrency) {
            return { [baseCurrency]: 1 };
        }

        if (formattedCache.has(targetCurrency)) {
            return formattedCache.get(targetCurrency);
        }

        try {
            const url = new URL('https://api.exchangerate.host/latest');
            url.searchParams.set('base', baseCurrency);
            url.searchParams.set('symbols', targetCurrency);
            const resp = await fetch(url.toString());
            if (!resp.ok) return null;
            const result = await resp.json();
            if (!result || !result.rates) return null;
            formattedCache.set(targetCurrency, result.rates);
            return result.rates;
        } catch (e) {
            return null;
        }
    }

    function parseNumber(value) {
        return Number(value.replace(/,/g, ''));
    }

    function getCurrencyLabel(code) {
        if (currencyDisplayNames) {
            try {
                const label = currencyDisplayNames.of(code);
                return label ? `${code} — ${label}` : code;
            } catch (e) {
                return code;
            }
        }
        return code;
    }

    function populateCurrencySelectors(currentCurrency) {
        const selectors = document.querySelectorAll('[data-currency-selector]');
        selectors.forEach((select) => {
            select.innerHTML = supportedCurrencies.map((code) => {
                return `<option value="${code}">${getCurrencyLabel(code)}</option>`;
            }).join('');
            select.value = currentCurrency;
            if (select.dataset.currencySelectorBound) return;

            select.addEventListener('change', async (event) => {
                const selected = event.target.value.toUpperCase();
                if (!supportedCurrencies.includes(selected)) return;
                localStorage.setItem('site_currency', selected);

                const locale = currencyLocaleMap[selected] || navigator.language || 'en-US';
                await updatePrices(locale, selected);
                document.querySelectorAll('[data-currency-selector]').forEach((otherSelect) => {
                    otherSelect.value = selected;
                });
            });

            select.dataset.currencySelectorBound = 'true';
        });
    }

    function formatPriceText(text, locale, currency, rate) {
        return text.replace(pricePattern, (match, amountPart) => {
            const amount = parseNumber(amountPart);
            if (Number.isNaN(amount)) return match;
            const converted = currency === baseCurrency ? amount : amount * (rate || 1);
            return formatCurrency(converted, currency, locale);
        });
    }

    async function updatePrices(locale, currency) {
        const rates = await fetchRates(currency);
        const rate = rates ? rates[currency] : 1;

        if (trackedPriceNodes.length === 0) {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {
                        if (!node.nodeValue || !node.nodeValue.includes('USD')) return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            while (walker.nextNode()) {
                const node = walker.currentNode;
                trackedPriceNodes.push({ node, originalText: node.nodeValue });
            }
        }

        trackedPriceNodes.forEach(({ node, originalText }) => {
            const formatted = formatPriceText(originalText, locale, currency, rate);
            if (formatted !== node.nodeValue) {
                node.nodeValue = formatted;
            }
        });
    }

    async function initCurrency() {
        const detectedCurrency = await detectCurrency();
        const navLocale = navigator.language || navigator.userLanguage || 'en-US';
        const locale = currencyLocaleMap[detectedCurrency] || navLocale || 'en-US';

        localStorage.setItem('site_currency', detectedCurrency);
        await updatePrices(locale, detectedCurrency);
        populateCurrencySelectors(detectedCurrency);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCurrency);
    } else {
        initCurrency();
    }
})();
