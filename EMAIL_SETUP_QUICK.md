# App Password Setup - Quick Start

## Default State (Works Out of the Box)

```env
# backend/.env
DEV_MODE=true
```

**OTP is logged to backend console** - no email needed for development.

### Test Registration:
```bash
curl -X POST http://localhost:5001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'
```

**Check backend console for OTP** (e.g. `136964`)

---

## To Use Gmail App Password

### 1. Get App Password
- Enable 2-Step Verification: https://myaccount.google.com/security
- Create App Password: https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows PC"
- Copy the 16-char password (format: `xxxx xxxx xxxx xxxx`)

### 2. Update `.env`

```env
# backend/.env
DEV_MODE=false

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
FROM_EMAIL=your-email@gmail.com
```

Replace:
- `your-email@gmail.com` → your Gmail email
- `xxxx xxxx xxxx xxxx` → your app password (include spaces or not - both work)

### 3. Restart Backend

```bash
cd backend
npm run server
```

You should see:
```
[EMAIL SERVICE] Configuring SMTP transporter:
  Host: smtp.gmail.com
  Port: 587
  Secure: false
  User: your-email@gmail.com
```

### 4. Test

Backend will now **send real emails** instead of logging to console.

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `SMTP_USER and SMTP_PASS are required` | Set `DEV_MODE=false` and fill SMTP credentials |
| `Invalid login: 535` | App password incorrect or 2-Step Verification not enabled |
| Still logging to console | Make sure `DEV_MODE=false` (not `true`) |
| Port 5001 already in use | Kill: `taskkill /PID [pid] /F` |

---

## Other Email Providers

### Outlook
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=app-password
```

---

## For Developers

- **DEV_MODE=true** → OTP logged to console (default, no SMTP needed)
- **DEV_MODE=false** → Sends real emails via SMTP

Full guide: `GMAIL_APP_PASSWORD_SETUP.md`
