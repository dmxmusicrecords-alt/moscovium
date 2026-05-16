# GoDaddy Sync Configuration

**Sync Your GitHub Repository with GoDaddy Hosting**

This guide enables automatic or manual synchronization between your GitHub repo and GoDaddy hosting.

---

## Table of Contents
1. [Quick Setup](#quick-setup)
2. [Manual Sync Method](#manual-sync-method)
3. [Automated Sync (GitHub Actions)](#automated-sync-github-actions)
4. [FTP Sync Scripts](#ftp-sync-scripts)
5. [Troubleshooting](#troubleshooting)

---

## Quick Setup

### Prerequisites
- GitHub account with repository access
- GoDaddy hosting account with cPanel
- FTP credentials from GoDaddy
- Git installed locally (for manual sync)

### Your Current Setup
```
Repository: dmxmusicrecords-alt/moscovium
Hosting: GoDaddy Shared Hosting (cPanel)
Type: Static HTML/CSS/JS
Default Branch: master
```

---

## Manual Sync Method

### Method 1: Using Git (Recommended for Developers)

#### Step 1: Clone Your Repository
```bash
cd ~/projects
git clone https://github.com/dmxmusicrecords-alt/moscovium.git
cd moscovium
```

#### Step 2: Connect to GoDaddy via SSH
```bash
ssh username@yourdomain.com
# Replace username with your GoDaddy cPanel username
# Replace yourdomain.com with your actual domain
```

#### Step 3: Deploy via Git Pull
```bash
# On your GoDaddy server
cd public_html
git clone https://github.com/dmxmusicrecords-alt/moscovium.git .

# For future updates
git pull origin master
```

#### Step 4: Set File Permissions
```bash
# Fix permissions for web files
chmod 644 *.html
chmod 644 *.css
chmod 644 *.js
chmod 755 images/
```

---

### Method 2: Download & Upload via FTP

#### Step 1: Download Repository
1. Go to: https://github.com/dmxmusicrecords-alt/moscovium
2. Click **Code** → **Download ZIP**
3. Extract files to local folder

#### Step 2: Connect via FTP
**Using FileZilla:**
1. Host: `ftp.yourdomain.com`
2. Username: Your cPanel username
3. Password: Your cPanel password
4. Port: `21` (or `22` for SFTP)
5. Click **Quickconnect**

**Using cPanel File Manager:**
1. Log into cPanel
2. Go to **Files** → **File Manager**
3. Navigate to `/public_html/`

#### Step 3: Upload Files
1. Drag extracted files to `/public_html/`
2. Ensure `index.html` is in root directory
3. Verify all CSS/JS files uploaded
4. Check file permissions (644 for files, 755 for directories)

---

## Automated Sync (GitHub Actions)

### Setup GitHub Actions for Auto-Deployment

#### Step 1: Create Workflow File

Create `.github/workflows/deploy-to-godaddy.yml`:

```yaml
name: Deploy to GoDaddy

on:
  push:
    branches:
      - master
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
      
      - name: Deploy Files via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.4
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./
          server-dir: /public_html/
          state-name: .ftp-deploy-sync-state.json
          dangerous-clean-slate: false
```

#### Step 2: Add GitHub Secrets

1. Go to: `https://github.com/dmxmusicrecords-alt/moscovium/settings/secrets/actions`
2. Click **New repository secret** for each:

```
FTP_SERVER = ftp.yourdomain.com
FTP_USERNAME = your_cpanel_username
FTP_PASSWORD = your_cpanel_password
```

#### Step 3: Trigger Deployment

Push to master branch:
```bash
git add .
git commit -m "Deploy to GoDaddy"
git push origin master
```

Monitor deployment: https://github.com/dmxmusicrecords-alt/moscovium/actions

---

## FTP Sync Scripts

### Script 1: Bash Script for Linux/Mac

Create `deploy.sh`:

```bash
#!/bin/bash

# GoDaddy FTP Sync Script
# Usage: ./deploy.sh

FTP_SERVER="ftp.yourdomain.com"
FTP_USER="your_cpanel_username"
FTP_PASS="your_cpanel_password"
LOCAL_DIR="$(pwd)"
REMOTE_DIR="/public_html"

echo "Starting FTP sync..."
echo "Server: $FTP_SERVER"
echo "Local: $LOCAL_DIR"
echo "Remote: $REMOTE_DIR"

# Create FTP batch file
cat > ftp_commands.txt << EOF
open $FTP_SERVER
$FTP_USER
$FTP_PASS
cd $REMOTE_DIR
binary
mput *.html
mput *.css
mput *.js
bye
EOF

# Execute FTP
ftp -n < ftp_commands.txt

# Cleanup
rm ftp_commands.txt

echo "Sync complete!"
```

Make executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Script 2: Python Script (Cross-Platform)

Create `deploy.py`:

```python
#!/usr/bin/env python3

import ftplib
import os
from pathlib import Path

# Configuration
FTP_SERVER = "ftp.yourdomain.com"
FTP_USER = "your_cpanel_username"
FTP_PASS = "your_cpanel_password"
REMOTE_DIR = "/public_html"
LOCAL_DIR = "."

# File types to upload
FILE_EXTENSIONS = ['.html', '.css', '.js', '.json', '.xml', '.txt']

def deploy():
    try:
        # Connect to FTP
        print(f"Connecting to {FTP_SERVER}...")
        ftp = ftplib.FTP(FTP_SERVER, FTP_USER, FTP_PASS)
        print("✓ Connected")
        
        # Change to remote directory
        ftp.cwd(REMOTE_DIR)
        print(f"✓ Changed to {REMOTE_DIR}")
        
        # Upload files
        local_path = Path(LOCAL_DIR)
        for file in local_path.iterdir():
            if file.suffix in FILE_EXTENSIONS:
                print(f"Uploading {file.name}...")
                with open(file, 'rb') as f:
                    ftp.storbinary(f'STOR {file.name}', f)
                print(f"✓ {file.name} uploaded")
        
        # Close connection
        ftp.quit()
        print("✓ Deployment complete!")
        
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    deploy()
```

Run:
```bash
python3 deploy.py
```

### Script 3: PowerShell Script (Windows)

Create `deploy.ps1`:

```powershell
# GoDaddy FTP Sync Script for Windows

$FtpServer = "ftp://ftp.yourdomain.com"
$FtpUser = "your_cpanel_username"
$FtpPass = "your_cpanel_password"
$LocalPath = "."

# Create FTP credential
$WebClient = New-Object System.Net.WebClient
$WebClient.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)

# Get files to upload
$files = Get-ChildItem -Path $LocalPath -Include *.html, *.css, *.js, *.json

foreach ($file in $files) {
    $Uri = "$FtpServer/public_html/$($file.Name)"
    Write-Host "Uploading $($file.Name)..."
    $WebClient.UploadFile($Uri, $file.FullName)
    Write-Host "✓ $($file.Name) uploaded"
}

Write-Host "Deployment complete!"
```

Run in PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\deploy.ps1
```

---

## Automated Sync Workflow

### Option 1: GitHub Actions (Best - No Server Setup)

✅ **Pros:**
- Automatic on push
- No local setup needed
- Free with GitHub

❌ **Cons:**
- Requires FTP credentials in GitHub secrets
- Small delay for workflow execution

### Option 2: Git on Server (Best - Direct Control)

✅ **Pros:**
- Immediate deployment
- Git history on server
- Full version control

❌ **Cons:**
- Requires SSH access
- Manual git pull needed
- More server resources

### Option 3: Manual FTP (Simple - No Automation)

✅ **Pros:**
- Complete control
- No automation risks
- Simple to understand

❌ **Cons:**
- Manual uploads each time
- Prone to mistakes
- Time consuming

---

## Sync Recommendations

### For Beginners:
```
1. Use manual FTP upload (FileZilla)
2. Upload after testing locally
3. Verify on domain before pushing to master
```

### For Developers:
```
1. Use GitHub Actions
2. Push to master = auto-deploy
3. Monitor deployment status
```

### For Large Teams:
```
1. Setup Git on GoDaddy server
2. Use staging environment
3. Pull-to-deploy workflow
```

---

## Troubleshooting Sync Issues

### Issue 1: FTP Connection Failed
```bash
# Test FTP connectivity
ftp yourdomain.com
# Or: ftp ftp.yourdomain.com

# Check credentials in cPanel
# Login to: cpanel.yourdomain.com
```

### Issue 2: GitHub Actions Failed
1. Check workflow logs: https://github.com/dmxmusicrecords-alt/moscovium/actions
2. Verify FTP credentials in secrets
3. Ensure FTP server is accessible

### Issue 3: Files Not Updated
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Check uploaded files via cPanel File Manager
# Verify permissions: chmod 644 *.html
```

### Issue 4: SSH Git Deployment Error
```bash
# Ensure Git is installed on GoDaddy
git --version

# Check SSH key setup
ssh-keygen -t rsa -b 4096
cat ~/.ssh/id_rsa.pub  # Add to GitHub SSH keys
```

---

## Sync Status Monitoring

### Check Deployment Status
```bash
# Test if latest files are deployed
curl -I https://yourdomain.com/index.html

# Check last modified date
stat /home/username/public_html/index.html
```

### Monitor GitHub Actions
- Dashboard: https://github.com/dmxmusicrecords-alt/moscovium/actions
- Check workflow runs
- View deployment logs
- Troubleshoot failures

---

## Security Best Practices

### ✅ Do:
- [ ] Use SFTP instead of FTP (port 22)
- [ ] Never commit FTP credentials to GitHub
- [ ] Use GitHub Secrets for sensitive data
- [ ] Restrict file permissions (644)
- [ ] Use SSH keys for server access
- [ ] Enable 2FA on GitHub account

### ❌ Don't:
- [ ] Store passwords in scripts
- [ ] Use plain FTP
- [ ] Commit .env files
- [ ] Overwrite .htaccess files
- [ ] Delete server-side configurations
- [ ] Grant 777 permissions

---

## Complete Deployment Workflow

### Step-by-Step:

```
1. Make changes to moscovium repository
   git add .
   git commit -m "Update website"
   git push origin master

2. (If manual) Download and upload to FTP
   OR (If automated) GitHub Actions deploys automatically

3. Test on domain
   https://yourdomain.com

4. Verify all pages load correctly

5. Check performance
   https://www.gtmetrix.com/

6. Monitor for errors
   Browser console (F12)
   GoDaddy error logs
```

---

## Additional Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **FTP Tools**: 
  - FileZilla: https://filezilla-project.org/
  - WinSCP: https://winscp.net/
  - Cyberduck: https://cyberduck.io/
- **SSH Guides**: https://www.ssh.com/
- **GoDaddy cPanel**: https://www.godaddy.com/help/manage-cpanel-3402

---

## Next Steps

1. [ ] Choose sync method (manual/automated)
2. [ ] Get GoDaddy FTP credentials
3. [ ] Test sync with first file
4. [ ] Monitor deployment
5. [ ] Set up monitoring/alerts

**Status**: Ready for sync setup  
**Last Updated**: 2026-05-16
