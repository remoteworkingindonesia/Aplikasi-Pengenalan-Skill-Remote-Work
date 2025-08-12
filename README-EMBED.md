# 🚀 RWI Skill Discovery Tool - Embeddable Version

> **Temukan skill tersembunyi untuk memulai karir remote working**

Tool assessment AI dari Remote Working Indonesia yang dapat di-embed ke website, Notion, atau platform apapun.

![Assessment Preview](https://img.shields.io/badge/Status-Ready%20to%20Embed-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎯 **Multi-stage Assessment** - Identifikasi skill tersembunyi secara komprehensif
- 🤖 **AI-Powered Analysis** - Rekomendasi pekerjaan remote dengan reasoning
- 📄 **PDF Generation** - Laporan lengkap yang bisa didownload
- 📧 **Email Integration** - Hasil assessment dikirim via email
- 📱 **Mobile Responsive** - Optimal di semua device
- 🔗 **Iframe Friendly** - Mudah di-embed dimana saja
- 📊 **Admin Dashboard** - Monitoring dan export data (Ctrl+Shift+A)

## 🚀 Quick Start

### 1. Deploy ke Platform Hosting

#### Option A: Vercel (Recommended)
```bash
# Deploy dengan Vercel CLI
npm i -g vercel
vercel --prod

# Atau deploy via GitHub
# 1. Push ke GitHub repository
# 2. Connect ke Vercel dashboard
# 3. Deploy otomatis
```

#### Option B: Netlify
```bash
# Deploy dengan Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=.

# Atau drag & drop ke Netlify dashboard
```

#### Option C: GitHub Pages
```bash
# Aktifkan GitHub Pages di repository settings
# Pilih branch: main
# Folder: / (root)
```

### 2. Embed ke Platform Anda

#### Basic Embed Code
```html
<iframe 
  src="https://your-domain.com/index.html" 
  width="100%" 
  height="800" 
  frameborder="0">
</iframe>
```

#### Notion Embed
1. Type `/embed` di halaman Notion
2. Paste URL: `https://your-domain.com/index.html`
3. Press Enter ✅

## 📋 Platform Support

| Platform | Status | Instructions |
|----------|--------|-------------|
| **Notion** | ✅ | Use `/embed` block |
| **WordPress** | ✅ | HTML block atau plugin |
| **Squarespace** | ✅ | Code block |
| **Wix** | ✅ | HTML iframe |
| **Webflow** | ✅ | Embed component |
| **React/Next.js** | ✅ | Custom component |
| **HTML Website** | ✅ | Direct iframe |

## 🛠️ Configuration

### EmailJS Setup
1. Create account di [EmailJS](https://emailjs.com)
2. Setup email service & template
3. Update konfigurasi di `components/EmailService.tsx`:

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'your_service_id',
  templateId: 'your_template_id', 
  publicKey: 'your_public_key'
};
```

### Custom Domain
Update di file konfigurasi:
- `vercel.json` untuk Vercel
- `netlify.toml` untuk Netlify  
- `CNAME` untuk GitHub Pages

## 📁 File Structure

```
├── index.html              # Main entry point (embeddable)
├── App.tsx                 # Main React application
├── components/
│   ├── AssessmentForm.tsx  # Multi-step assessment
│   ├── ResultsDisplay.tsx  # AI-powered results
│   ├── PDFGenerator.tsx    # PDF export
│   ├── EmailService.tsx    # Email integration
│   └── AdminPanel.tsx      # Data monitoring
├── styles/
│   └── globals.css         # Tailwind CSS
├── email-templates/
│   └── assessment-results.html
├── embed-guide.md          # Detailed embedding instructions
├── vercel.json            # Vercel deployment config
└── netlify.toml           # Netlify deployment config
```

## 🎨 Customization

### Branding
Edit `index.html` untuk custom branding:

```html
<!-- Logo & Title -->
<div class="w-12 h-12 bg-blue-600 rounded-xl">
  🚀 <!-- Ganti dengan logo Anda -->
</div>
<h1>Your Company Name</h1>
```

### Colors & Styling
Edit `styles/globals.css` untuk custom theme:

```css
:root {
  --primary: #your-color;
  --background: #your-bg;
  /* ... */
}
```

### Content
Edit welcome message di `App.tsx`:

```javascript
<p>Selamat datang di assessment tool dari [Company Name]!</p>
```

## 📊 Analytics & Monitoring

### Usage Tracking
Built-in analytics tersimpan di localStorage:

```javascript
// Access analytics data
const analytics = JSON.parse(
  localStorage.getItem('rwi_embed_analytics') || '[]'
);
```

### Admin Panel
- Press `Ctrl+Shift+A` untuk admin access
- View assessment data & export CSV
- Monitor email delivery & newsletter signups

## 🔒 Security

### CSP Headers
```
Content-Security-Policy: frame-ancestors *;
X-Frame-Options: ALLOWALL
```

### HTTPS Only
Selalu gunakan HTTPS untuk embedding:
```html
<iframe src="https://your-domain.com/index.html"></iframe>
```

## 📱 Mobile Optimization

### Responsive Iframe
```css
.responsive-embed {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 ratio */
}

.responsive-embed iframe {
  position: absolute;
  width: 100%;
  height: 100%;
}
```

## 🌍 Internationalization

Currently supports:
- 🇮🇩 **Bahasa Indonesia** (Primary)
- 🇺🇸 **English** (Planned)

## 🚨 Troubleshooting

### Common Issues

#### 1. Iframe Not Loading
```bash
# Check HTTPS
✅ https://your-domain.com
❌ http://your-domain.com

# Verify CSP headers
curl -I https://your-domain.com
```

#### 2. Cross-Origin Errors
- Ensure proper CSP configuration
- Check `X-Frame-Options` header
- Verify domain whitelist

#### 3. Mobile Display Issues
- Test responsive breakpoints
- Check viewport meta tag
- Adjust iframe dimensions

## 📞 Support

Butuh bantuan embedding atau custom integration?

- **📧 Email**: remoteworkingindonesia@gmail.com
- **📱 Instagram**: [@remoteworkingindonesia](https://instagram.com/remoteworkingindonesia)
- **🧵 Threads**: [@remoteworkingindonesia](https://threads.net/@remoteworkingindonesia)

## 🎯 Next Steps

Setelah deploy dan embed berhasil:

1. **Test di berbagai platform** untuk memastikan kompatibilitas
2. **Setup monitoring** untuk track usage dan performance
3. **Customize branding** sesuai dengan brand Anda
4. **Integrate analytics** untuk insights yang lebih dalam
5. **Setup email automation** untuk follow-up otomatis

## 📈 Usage Examples

### Simple Website Embed
```html
<div style="margin: 2rem 0;">
  <h2>Temukan Skill Remote Work Anda</h2>
  <p>Assessment gratis dari Remote Working Indonesia</p>
  <iframe 
    src="https://rwi-assessment.vercel.app" 
    width="100%" 
    height="800"
    style="border: none; border-radius: 12px;">
  </iframe>
</div>
```

### WordPress Shortcode
```php
// functions.php
function rwi_assessment_shortcode($atts) {
    $atts = shortcode_atts([
        'width' => '100%',
        'height' => '800'
    ], $atts);
    
    return '<iframe src="https://rwi-assessment.vercel.app" 
            width="' . $atts['width'] . '" 
            height="' . $atts['height'] . '"
            style="border:none;border-radius:12px;"></iframe>';
}
add_shortcode('rwi-assessment', 'rwi_assessment_shortcode');

// Usage: [rwi-assessment width="100%" height="900"]
```

## 📄 License

MIT License - Silakan gunakan dan modifikasi sesuai kebutuhan.

---

**🚀 Ready to embed? Start with the Quick Start guide above!**

*Semangat Lokal, Ruang Kerja Global 🇮🇩*
<!-- trigger build -->
