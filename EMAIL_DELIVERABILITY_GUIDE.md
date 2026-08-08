# Email Deliverability Guide - Avoid Gmail Spam Folder

## ✅ Changes Made to Code

### ResendEmailService.java Improvements:
1. **Better plain text extraction** - Removes style/script tags and HTML entities
2. **Custom email headers** - Added X-Entity-Ref-ID, X-Mailer, List-Unsubscribe
3. **Email tags** - Added category and environment tags for better tracking
4. **User-Agent header** - Identifies your application to email servers
5. **Enhanced logging** - Better debugging information

## 🚨 CRITICAL: You MUST Use a Custom Domain

**Problem:** You're currently using `onboarding@resend.dev` which is a shared Resend domain.

**Solution:** Use your own domain (recommended) or a subdomain like `noreply@yourdomain.com`

### Steps to Set Up Custom Domain in Resend:

1. **Go to Resend Dashboard** → Domains → Add Domain
2. **Add your domain** (e.g., `yourdomain.com` or `mail.yourdomain.com`)
3. **Configure DNS Records** that Resend provides:
   - **SPF Record** - Verifies sender identity
   - **DKIM Record** - Cryptographic signature
   - **DMARC Record** - Email authentication policy
   - **MX Records** (if receiving emails)

4. **Wait for DNS verification** (can take 24-48 hours)

5. **Update your application.properties:**
```properties
# Change this from onboarding@resend.dev to your domain
resend.from.email=noreply@yourdomain.com
resend.from.name=HRMS System
```

6. **Update Render Environment Variables:**
   - `RESEND_FROM_EMAIL=noreply@yourdomain.com`
   - `RESEND_FROM_NAME=HRMS System`

## 📧 DNS Records You Need (Example)

When you add your domain in Resend, you'll get records like these to add to your DNS provider:

### SPF Record (TXT)
```
Type: TXT
Name: @ (or your subdomain)
Value: v=spf1 include:_spf.resend.com ~all
```

### DKIM Record (TXT)
```
Type: TXT
Name: resend._domainkey
Value: [Resend will provide this - it's a long cryptographic key]
```

### DMARC Record (TXT)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
```

## 📊 Email Best Practices (Already Implemented in Code)

✅ **Plain text version** - Gmail requires both HTML and plain text
✅ **Reply-to address** - Allows recipients to respond
✅ **List-Unsubscribe header** - Reduces spam complaints
✅ **Proper from format** - "Name <email@domain.com>"
✅ **Tags for categorization** - Marks emails as transactional
✅ **Custom headers** - Improves email tracking

## 🔍 Testing Email Deliverability

### 1. Use Mail-Tester
- Send a test email to the address provided by https://www.mail-tester.com/
- You'll get a score out of 10
- Follow their recommendations

### 2. Check DNS Records
```bash
# Check SPF
nslookup -type=txt yourdomain.com

# Check DKIM
nslookup -type=txt resend._domainkey.yourdomain.com

# Check DMARC
nslookup -type=txt _dmarc.yourdomain.com
```

### 3. Monitor Resend Dashboard
- Check email delivery status
- Monitor bounce rates
- Check spam complaint rates

## 📝 Email Content Best Practices

### Avoid These (Spam Triggers):
- ❌ ALL CAPS IN SUBJECT
- ❌ Multiple exclamation marks!!!
- ❌ Words like "FREE", "URGENT", "ACT NOW"
- ❌ Too many images, not enough text
- ❌ Shortened URLs (bit.ly, etc.)
- ❌ Large attachments

### Do These:
- ✅ Personalize with recipient name
- ✅ Use clear, professional subject lines
- ✅ Include physical address in footer
- ✅ Provide easy unsubscribe option
- ✅ Use responsive HTML templates
- ✅ Test on multiple email clients

## 🛠️ Current Configuration Status

### ✅ Working:
- Resend API integration
- HTML email templates
- Plain text fallback
- Custom headers

### ⚠️ Needs Action:
1. **Set up custom domain in Resend** (MOST IMPORTANT)
2. **Configure DNS records** (SPF, DKIM, DMARC)
3. **Update environment variables** with new domain
4. **Test deliverability** with mail-tester.com

## 🚀 Deployment Checklist

### Render (Backend):
- [ ] Add custom domain to Resend
- [ ] Verify DNS records are propagated
- [ ] Update `RESEND_FROM_EMAIL` environment variable
- [ ] Update `RESEND_FROM_NAME` environment variable
- [ ] Redeploy backend service
- [ ] Test email sending

### Vercel (Frontend):
- [ ] No changes needed for frontend
- [ ] Verify API URL is correct

## 📞 If Emails Still Go to Spam

1. **Warm up your domain** - Start with low volume (10-20 emails/day), gradually increase
2. **Ask recipients to whitelist** - Add your email to contacts
3. **Monitor engagement** - Higher open rates = better reputation
4. **Check blacklists** - Use https://mxtoolbox.com/blacklists.aspx
5. **Contact Resend support** - They can check your sending reputation

## 🔗 Useful Resources

- [Resend Domain Setup Guide](https://resend.com/docs/dashboard/domains/introduction)
- [Email Deliverability Best Practices](https://resend.com/docs/knowledge-base/deliverability)
- [SPF/DKIM/DMARC Checker](https://mxtoolbox.com/)
- [Mail Tester](https://www.mail-tester.com/)
- [Google Postmaster Tools](https://postmaster.google.com/)

## 🎯 Expected Results

After implementing these changes:
- **Before:** Emails go to spam
- **After:** 
  - Emails land in inbox
  - Better sender reputation
  - Lower bounce rates
  - Professional appearance
  - Trackable delivery metrics

---

**Note:** The custom domain setup is the #1 most important factor. Without it, emails will continue to have deliverability issues regardless of other optimizations.
