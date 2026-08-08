# 🌐 Domain Verification Guide for Resend

## Current Status:
- **Domain**: omoikaneinnovations.com
- **Status**: Not Started ⚠️
- **Region**: Tokyo (ap-northeast-1)

---

## 📋 Step-by-Step Instructions

### Step 1: Click on Your Domain in Resend

1. Go to https://resend.com/domains
2. Click on **`omoikaneinnovations.com`**
3. You'll see DNS records that need to be added

---

### Step 2: Get DNS Records from Resend

After clicking your domain, Resend will show you DNS records like this:

#### Required DNS Records:

**1. SPF Record (TXT)**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**2. DKIM Record (TXT)**
```
Type: TXT
Name: resend._domainkey
Value: [Resend will provide this value]
```

**3. DMARC Record (TXT)**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none
```

---

### Step 3: Add DNS Records to Your Domain Provider

#### Where did you buy omoikaneinnovations.com?
- GoDaddy
- Namecheap
- Google Domains
- Hostinger
- Other?

#### General Steps (for any provider):

1. **Login to your domain registrar** (where you bought the domain)
2. **Go to DNS Management** or **DNS Settings**
3. **Add the TXT records** that Resend provides
4. **Save changes**

---

### Step 4: Example for Common Providers

#### For GoDaddy:
1. Login to GoDaddy
2. Go to **My Products** → **Domains**
3. Click **DNS** next to omoikaneinnovations.com
4. Scroll to **Records** section
5. Click **Add** button
6. Select **Type: TXT**
7. Enter **Name** and **Value** from Resend
8. Click **Save**
9. Repeat for all 3 records

#### For Namecheap:
1. Login to Namecheap
2. Go to **Domain List**
3. Click **Manage** next to omoikaneinnovations.com
4. Go to **Advanced DNS** tab
5. Click **Add New Record**
6. Select **Type: TXT Record**
7. Enter **Host** and **Value** from Resend
8. Click **Save**
9. Repeat for all 3 records

#### For Cloudflare:
1. Login to Cloudflare
2. Select **omoikaneinnovations.com**
3. Go to **DNS** tab
4. Click **Add record**
5. Select **Type: TXT**
6. Enter **Name** and **Content** from Resend
7. Click **Save**
8. Repeat for all 3 records

---

### Step 5: Verify in Resend

After adding DNS records:

1. Wait 5-10 minutes (DNS propagation)
2. Go back to Resend dashboard
3. Click **Verify** button on your domain
4. Status should change to **Verified** ✅

---

### Step 6: Update Your Application Configuration

After domain is verified, update these files:

#### Update `.env`:
```env
RESEND_FROM_EMAIL=noreply@omoikaneinnovations.com
```

#### Update `application.properties`:
```properties
resend.from.email=${RESEND_FROM_EMAIL:noreply@omoikaneinnovations.com}
```

#### Update Render Environment Variables:
```
RESEND_FROM_EMAIL=noreply@omoikaneinnovations.com
```

---

## 🔍 Troubleshooting

### Problem: Domain still shows "Not Started"

**Solution:** Click on the domain in Resend to see DNS records and follow verification steps

### Problem: DNS records not verifying

**Solutions:**
1. Wait 10-30 minutes for DNS propagation
2. Check if records are added correctly (no typos)
3. Make sure TXT records are added to the root domain (not subdomain)
4. Click "Verify" button in Resend after waiting

### Problem: Don't know where domain is registered

**Solution:** Check WHOIS lookup: https://who.is/whois/omoikaneinnovations.com

---

## ✅ Final Result

After completing verification:

### Before:
- ❌ From: onboarding@resend.dev
- ⚠️ Goes to spam

### After:
- ✅ From: noreply@omoikaneinnovations.com
- ✅ Goes to inbox
- ✅ Professional appearance
- ✅ Better deliverability

---

## 📧 Testing After Domain Verification

Once domain is verified, test sending:

```bash
node test-resend-email.js
```

Update the test file to use your domain:
```javascript
const FROM_EMAIL = 'noreply@omoikaneinnovations.com';
```

---

## 🎯 Quick Checklist

- [ ] Click on domain in Resend to see DNS records
- [ ] Login to domain registrar (GoDaddy/Namecheap/etc.)
- [ ] Add SPF record (TXT)
- [ ] Add DKIM record (TXT)
- [ ] Add DMARC record (TXT)
- [ ] Wait 10 minutes for DNS propagation
- [ ] Click "Verify" in Resend dashboard
- [ ] Domain status changes to "Verified" ✅
- [ ] Update RESEND_FROM_EMAIL in .env
- [ ] Update RESEND_FROM_EMAIL in Render
- [ ] Test sending email
- [ ] Emails now go to inbox! 🎉

---

## 📞 Need Help?

**Where did you register omoikaneinnovations.com?**
Tell me your domain provider and I can give you specific instructions!

Common providers:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- Hostinger
- Porkbun
- Other?
