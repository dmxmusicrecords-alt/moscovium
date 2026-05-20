# DNS Setup Guide for GoDaddy

**Manage DNS Settings for Domains Not Registered with GoDaddy**

Complete guide for pointing your external domain to GoDaddy hosting and configuring DNS records.

---

## Table of Contents
1. [Overview](#overview)
2. [Getting GoDaddy Nameservers](#getting-godaddy-nameservers)
3. [Updating DNS at Your Registrar](#updating-dns-at-your-registrar)
4. [GoDaddy DNS Configuration](#godaddy-dns-configuration)
5. [DNS Records Setup](#dns-records-setup)
6. [Verification & Testing](#verification--testing)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### Your Current Setup
```
Repository: dmxmusicrecords-alt/moscovium
Hosting: GoDaddy Shared Hosting (cPanel)
Domain: yourdomain.com (external registration)
Website Type: Static HTML/CSS/JS
```

### What is DNS?
DNS (Domain Name System) translates your domain name (yourdomain.com) into an IP address that points to your hosting server.

**Example:**
```
yourdomain.com → DNS → GoDaddy Server IP → Your Website
```

---

## Getting GoDaddy Nameservers

### Step 1: Access Your GoDaddy Hosting Account
1. Log in to: https://www.godaddy.com/
2. Go to **Products** → **Hosting** → Select your hosting plan
3. Click **Manage**

### Step 2: Find Your Nameservers

In your GoDaddy hosting panel:
- Look for **DNS** or **Nameservers** section
- You'll see something like:

```
Nameserver 1: ns1.godaddy.com
Nameserver 2: ns2.godaddy.com
Nameserver 3: ns3.godaddy.com
Nameserver 4: ns4.godaddy.com
```

### Step 3: Find Your Server IP Address

Also in the hosting panel:
```
Server IP: XXX.XXX.XXX.XXX  (Example: 123.45.67.89)
Shared IP: XXX.XXX.XXX.XXX
```

**Save these values** - you'll need them next!

---

## Updating DNS at Your Registrar

### For Domains Registered Elsewhere (Not GoDaddy)

**Common registrars:**
- Namecheap
- Register.com
- Domain.com
- 1&1 / IONOS
- Bluehost
- Network Solutions
- Any other registrar

### Step 1: Log in to Your Domain Registrar

Example for Namecheap:
1. Go to: https://www.namecheap.com/
2. Log in to your account
3. Go to **Dashboard** → **Manage Domains**
4. Click **Manage** next to your domain

### Step 2: Find DNS/Nameserver Settings

Look for sections named:
- **Nameservers** (Most common)
- **DNS**
- **Hosting Settings**
- **Custom DNS**

### Step 3: Replace Nameservers

**Remove old nameservers:**
- Clear any existing nameservers
- Note: This may take effect immediately

**Add GoDaddy nameservers:**
```
Nameserver 1: ns1.godaddy.com
Nameserver 2: ns2.godaddy.com
Nameserver 3: ns3.godaddy.com
Nameserver 4: ns4.godaddy.com
```

**Example in Namecheap:**
```
Nameserver 1: ns1.godaddy.com
Nameserver 2: ns2.godaddy.com
```

### Step 4: Save Changes

- Click **Save**, **Apply**, or **Update**
- You may see a confirmation message
- **Wait 24-48 hours** for propagation

### Propagation Status Tracker

Check DNS propagation:
- https://www.whatsmydns.net/ (Universal)
- https://dnschecker.org/
- https://mxtoolbox.com/

---

## GoDaddy DNS Configuration

### Step 1: Access GoDaddy DNS Settings

1. Log in to GoDaddy: https://www.godaddy.com/
2. **Products** → **Domains** (or Hosting)
3. Find your domain and click **Manage DNS**

### Step 2: GoDaddy DNS Console

You'll see sections for:
- **A Records** (points to server IP)
- **CNAME Records** (aliases)
- **MX Records** (email)
- **TXT Records** (verification)
- **NS Records** (nameservers)

---

## DNS Records Setup

### Record 1: A Record (Main Domain)

**Purpose:** Points yourdomain.com to your GoDaddy server

```
Type:     A
Name:     @ (or blank, represents root domain)
Value:    XXX.XXX.XXX.XXX (Your GoDaddy Server IP)
TTL:      3600 (or 1 hour)
```

**Steps:**
1. In GoDaddy DNS panel, find **A Records**
2. Click **Add Record** or **Edit**
3. Set Type: **A**
4. Name: **@** (root domain)
5. Value: Your GoDaddy server IP
6. Click **Save**

### Record 2: CNAME Record (www subdomain)

**Purpose:** Points www.yourdomain.com to yourdomain.com

```
Type:     CNAME
Name:     www
Value:    yourdomain.com (or @)
TTL:      3600
```

**Steps:**
1. Click **Add Record**
2. Type: **CNAME**
3. Name: **www**
4. Value: **yourdomain.com** or **@**
5. Click **Save**

### Record 3: MX Records (Email - Optional)

If you want email on your domain:

```
Type:     MX
Name:     @
Value:    mail.yourdomain.com
Priority: 10
TTL:      3600
```

**Or use GoDaddy email:**
```
Type:     MX
Name:     @
Value:    mxa.mailprotect.com
Priority: 10

Type:     MX
Name:     @
Value:    mxb.mailprotect.com
Priority: 20
```

### Record 4: TXT Records (SPF/DKIM - Optional)

For email authentication:

**SPF Record:**
```
Type:     TXT
Name:     @
Value:    v=spf1 include:_spf.google.com ~all
```

**DKIM Records:**
Ask your email provider for specific values

### Record 5: CNAME for ACME (SSL Certificate - Optional)

If using Let's Encrypt:
```
Type:     CNAME
Name:     _acme-challenge
Value:    (Provided by Let's Encrypt)
```

---

## Complete DNS Configuration Example

Here's what your final DNS records should look like:

```
TYPE    NAME    VALUE                       TTL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A       @       123.45.67.89               3600
CNAME   www     yourdomain.com             3600
MX      @       aspmx.l.google.com         3600
TXT     @       v=spf1 include:_spf...     3600
NS      @       ns1.godaddy.com            3600
NS      @       ns2.godaddy.com            3600
```

---

## Verification & Testing

### Step 1: Check Nameserver Propagation

#### Using Command Line:

**On Windows (Command Prompt):**
```cmd
nslookup yourdomain.com
nslookup -type=ns yourdomain.com
```

**On Mac/Linux:**
```bash
nslookup yourdomain.com
dig yourdomain.com
dig yourdomain.com NS
```

**Expected output:**
```
Non-authoritative answer:
Name:    yourdomain.com
Address: 123.45.67.89
```

#### Using Online Tools:
- https://www.whatsmydns.net/
- https://mxtoolbox.com/
- https://dnschecker.org/

### Step 2: Verify DNS Records

**Command line (Mac/Linux):**
```bash
# Check A record
dig yourdomain.com A

# Check CNAME
dig www.yourdomain.com

# Check MX
dig yourdomain.com MX

# Check all records
dig yourdomain.com ANY
```

**Expected results:**
```
yourdomain.com. 3600 IN A 123.45.67.89
www.yourdomain.com. 3600 IN CNAME yourdomain.com
```

### Step 3: Test Website Accessibility

Test these URLs in your browser:

1. **http://yourdomain.com** - Should show your website
2. **http://www.yourdomain.com** - Should redirect to yourdomain.com
3. **https://yourdomain.com** - Test SSL (if enabled)

```bash
# Test with curl
curl -I http://yourdomain.com
curl -I http://www.yourdomain.com
```

### Step 4: Email Configuration Test (If applicable)

```bash
# Check MX records
nslookup -type=MX yourdomain.com

# Expected output
yourdomain.com MX preference = 10, mail exchanger = mail.yourdomain.com
```

---

## DNS Propagation Timeline

```
Immediate:     Changes submitted to GoDaddy
15 minutes:    GoDaddy updates its nameservers
1-4 hours:     Most ISPs update their DNS caches
4-24 hours:    Most of the internet updated
24-48 hours:   All DNS propagation complete
```

### During propagation:
- Some users may see old website
- Some users may see new website
- This is normal!

### Expedite propagation:
```bash
# Clear local DNS cache

# Windows (Command Prompt - as Administrator)
ipconfig /flushdns

# Mac (Terminal)
sudo dscacheutil -flushcache

# Linux
sudo systemctl restart nscd
```

---

## Troubleshooting DNS Issues

### Issue 1: Domain Still Points to Old Host

**Problem:** Website shows old content even after DNS change

**Solution:**
```bash
# Check what DNS is returning
nslookup yourdomain.com

# If it returns old IP:
# - Wait up to 48 hours (DNS propagation)
# - Check your nameserver settings at registrar
# - Verify GoDaddy DNS records are correct
# - Clear browser cache (Ctrl+Shift+Del)
```

### Issue 2: Domain Not Resolving (404 errors)

**Problem:** "This domain can't be reached"

**Solution:**
1. Verify A record is set correctly:
   ```bash
   dig yourdomain.com
   ```
2. Check that value matches GoDaddy server IP
3. Ensure you updated nameservers at registrar
4. Wait 24 hours for propagation

### Issue 3: www Subdomain Not Working

**Problem:** www.yourdomain.com shows error, but yourdomain.com works

**Solution:**
Add CNAME record:
```
Type: CNAME
Name: www
Value: yourdomain.com
```

### Issue 4: Email Not Working

**Problem:** Emails bounce or won't send

**Solution:**
1. Verify MX records exist
2. Check MX record priority
3. Test with online MX checker: https://mxtoolbox.com/
4. Contact your email provider

### Issue 5: SSL Certificate Issues

**Problem:** HTTPS shows security warning

**Solution:**
1. Install SSL on GoDaddy (through cPanel)
2. Update DNS TXT records for verification
3. Wait for certificate issuance (1-48 hours)
4. Update website to use https://
5. Set up redirect from http to https

---

## Complete DNS Checklist

### Pre-Deployment
- [ ] GoDaddy hosting account created
- [ ] GoDaddy server IP obtained
- [ ] Nameservers noted: ns1.godaddy.com, ns2.godaddy.com
- [ ] Domain registrar account accessed
- [ ] Current nameservers documented (for backup)

### DNS Configuration
- [ ] A record created (@ → Server IP)
- [ ] CNAME record created (www → domain)
- [ ] MX records added (if using email)
- [ ] TXT/SPF records added (if needed)
- [ ] Changes saved at registrar
- [ ] Changes saved at GoDaddy

### Verification
- [ ] Nameservers updated at registrar
- [ ] DNS propagation checked (whatsmydns.net)
- [ ] Website accessible at yourdomain.com
- [ ] www subdomain redirects properly
- [ ] SSL certificate installed (if https)
- [ ] Email working (if MX configured)

### Monitoring
- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] Assets load (CSS, JS, images)
- [ ] Performance acceptable
- [ ] No redirect loops
- [ ] Analytics tracking working

---

## Command Reference

### Quick DNS Test Commands

**Nameservers:**
```bash
nslookup -type=NS yourdomain.com
```

**A Records:**
```bash
nslookup yourdomain.com
dig yourdomain.com
```

**CNAME Records:**
```bash
nslookup www.yourdomain.com
```

**MX Records:**
```bash
nslookup -type=MX yourdomain.com
dig yourdomain.com MX
```

**All Records:**
```bash
dig yourdomain.com ANY
```

**Propagation Check:**
```bash
# Multiple checks
for i in {1..5}; do echo "Check $i:"; nslookup yourdomain.com; sleep 10; done
```

---

## DNS Record Types Reference

| Type | Purpose | Example |
|------|---------|---------|
| A | Maps domain to IPv4 | yourdomain.com → 123.45.67.89 |
| AAAA | Maps domain to IPv6 | yourdomain.com → 2001:db8::1 |
| CNAME | Alias for another domain | www → yourdomain.com |
| MX | Email server | yourdomain.com → mail.yourdomain.com |
| TXT | Text records (SPF, DKIM) | v=spf1 include:_spf... |
| NS | Nameservers | yourdomain.com → ns1.godaddy.com |
| SOA | Zone start of authority | Describes zone authority |
| SRV | Service records | Specific services |
| PTR | Reverse DNS | IP → Domain |

---

## Security Best Practices

### ✅ Do:
- [ ] Keep nameservers private (don't share publicly)
- [ ] Use strong GoDaddy account password
- [ ] Enable 2FA on GoDaddy account
- [ ] Keep DNS records documented
- [ ] Monitor for unauthorized changes
- [ ] Use MFA for registrar account
- [ ] Set TTL appropriately (3600)

### ❌ Don't:
- [ ] Share DNS credentials
- [ ] Expose sensitive DNS records
- [ ] Publish email addresses from MX
- [ ] Leave test records in production
- [ ] Change nameservers unnecessarily
- [ ] Ignore DNS propagation warnings
- [ ] Use very low TTL values

---

## Additional Resources

### GoDaddy Resources
- **GoDaddy DNS Help**: https://www.godaddy.com/help/manage-dns-770
- **GoDaddy Nameservers**: https://www.godaddy.com/help/setting-nameservers-3401
- **GoDaddy cPanel**: https://www.godaddy.com/help/manage-cpanel-3402

### DNS Testing Tools
- **DNS Propagation**: https://www.whatsmydns.net/
- **MX Toolbox**: https://mxtoolbox.com/
- **DNS Checker**: https://dnschecker.org/

### Learning Resources
- **DNS Guide**: https://www.cloudflare.com/learning/dns/what-is-dns/
- **How DNS Works**: https://www.youtube.com/results?search_query=how+dns+works
- **ICANN WHOIS**: https://www.icann.org/

---

## Next Steps

1. [ ] Get GoDaddy server IP address
2. [ ] Obtain GoDaddy nameservers
3. [ ] Update nameservers at registrar
4. [ ] Configure A and CNAME records
5. [ ] Wait 24-48 hours for propagation
6. [ ] Test website accessibility
7. [ ] Install SSL certificate
8. [ ] Set up monitoring/alerts

**Status**: DNS setup guide created  
**Last Updated**: 2026-05-16  
**Repository**: dmxmusicrecords-alt/moscovium
