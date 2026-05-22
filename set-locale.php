<?php
// Simple locale setter: sets a cookie `site_lang` and redirects back.
$supported = ['en','sw','fr'];
$lang = isset($_GET['lang']) ? strtolower(substr($_GET['lang'],0,2)) : '';
$redirect = isset($_GET['redirect']) ? $_GET['redirect'] : '/';

if (!in_array($lang, $supported)) {
    // fallback to en
    $lang = 'en';
}

// Basic safe redirect: allow relative paths or same-host absolute URLs
$allow_redirect = '/';
if ($redirect) {
    // if redirect starts with /, allow
    if (strpos($redirect, '/') === 0) {
        $allow_redirect = $redirect;
    } else {
        // otherwise attempt to parse and allow if same host
        $url_parts = parse_url($redirect);
        if ($url_parts && isset($url_parts['host']) && $url_parts['host'] === $_SERVER['HTTP_HOST']) {
            $allow_redirect = $redirect;
        }
    }
}

// set cookie for 30 days
setcookie('site_lang', $lang, time() + 60*60*24*30, '/');

header('Location: ' . $allow_redirect);
exit;
