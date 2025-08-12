# 🚀 RWI Skill Discovery Tool - Embedding Guide

Panduan lengkap untuk meng-embed Skill Discovery Tool dari Remote Working Indonesia ke berbagai platform.

## 📋 Quick Start

### Basic Iframe Embed
```html
<iframe 
  src="https://your-domain.com/index.html" 
  width="100%" 
  height="800" 
  frameborder="0" 
  allowtransparency="true">
</iframe>
```

### Responsive Iframe
```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 100%;">
  <iframe 
    src="https://your-domain.com/index.html" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allowtransparency="true">
  </iframe>
</div>
```

## 🌐 Platform-Specific Instructions

### 1. Notion Embedding

#### Method 1: Using Embed Block
1. Type `/embed` in your Notion page
2. Paste your domain URL: `https://your-domain.com/index.html`
3. Press Enter

#### Method 2: Using Code Block
```html
<iframe 
  src="https://your-domain.com/index.html" 
  width="100%" 
  height="900" 
  style="border: none; border-radius: 8px;">
</iframe>
```

### 2. WordPress

#### Gutenberg Editor:
1. Add "HTML" block
2. Paste the iframe code
3. Update/Publish

#### Classic Editor:
1. Switch to "Text" tab
2. Paste the iframe code
3. Save

#### WordPress Code:
```html
<div class="rwi-assessment-embed">
  <iframe 
    src="https://your-domain.com/index.html" 
    width="100%" 
    height="800" 
    frameborder="0"
    loading="lazy"
    title="RWI Skill Discovery Assessment">
  </iframe>
</div>

<style>
.rwi-assessment-embed {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
```

### 3. React/Next.js Website

```jsx
import React from 'react';

const RWIAssessmentEmbed = ({ 
  width = "100%", 
  height = "800px",
  className = "" 
}) => {
  return (
    <div className={`rwi-embed-container ${className}`}>
      <iframe
        src="https://your-domain.com/index.html"
        width={width}
        height={height}
        frameBorder="0"
        allowTransparency={true}
        title="RWI Skill Discovery Assessment"
        loading="lazy"
        style={{
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  );
};

export default RWIAssessmentEmbed;
```

### 4. HTML Website

```html
<!DOCTYPE html>
<html>
<head>
  <title>Assessment Tool</title>
  <style>
    .assessment-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    .assessment-frame {
      width: 100%;
      height: 900px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      .assessment-frame {
        height: 700px;
      }
    }
  </style>
</head>
<body>
  <div class="assessment-container">
    <h1>Temukan Skill Remote Work Anda</h1>
    <p>Assessment gratis dari Remote Working Indonesia</p>
    
    <iframe 
      src="https://your-domain.com/index.html"
      class="assessment-frame"
      title="RWI Skill Assessment"
      loading="lazy">
    </iframe>
  </div>
</body>
</html>
```

### 5. Squarespace

1. Go to the page where you want to embed
2. Click the "+" to add a content block
3. Choose "Code" block
4. Paste the iframe code
5. Save

### 6. Wix

1. Click "Add" on the left panel
2. Select "Embed Code"
3. Choose "HTML iframe"
4. Paste your iframe code
5. Adjust size and position

### 7. Webflow

1. Drag an "Embed" component to your page
2. Paste the iframe code
3. Set width to 100% and height to 800px
4. Publish your site

## 🎨 Customization Options

### Responsive Sizing
```css
/* Responsive iframe wrapper */
.responsive-iframe {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* 4:3 Aspect Ratio */
  overflow: hidden;
}

.responsive-iframe iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .responsive-iframe {
    padding-bottom: 100%; /* Square on mobile */
  }
}
```

### Styling Options
```css
/* Custom styling for embed container */
.rwi-assessment-embed {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 16px;
  margin: 2rem 0;
}

.rwi-assessment-embed iframe {
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Loading state */
.rwi-embed-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #f8fafc;
  border-radius: 12px;
  color: #64748b;
}
```

## 🔧 Advanced Integration

### With Loading State
```html
<div id="rwi-assessment-container">
  <div id="rwi-loading" class="rwi-embed-loading">
    <div>Loading assessment...</div>
  </div>
  <iframe 
    id="rwi-iframe"
    src="https://your-domain.com/index.html"
    style="display: none; width: 100%; height: 800px; border: none;"
    onload="document.getElementById('rwi-loading').style.display='none'; this.style.display='block';">
  </iframe>
</div>
```

### With Analytics Tracking
```javascript
// Track embed usage
window.addEventListener('message', function(event) {
  if (event.data.type === 'RWI_EMBED_LOADED') {
    // Track successful load
    gtag('event', 'rwi_assessment_loaded', {
      'custom_parameter': event.data.timestamp
    });
  }
});
```

### Auto-resize Iframe
```javascript
// Auto-resize iframe based on content
function resizeRWIIframe() {
  const iframe = document.getElementById('rwi-iframe');
  if (iframe) {
    iframe.onload = function() {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const height = iframeDoc.documentElement.scrollHeight;
        iframe.style.height = (height + 50) + 'px';
      } catch (e) {
        // Cross-origin restrictions - use default height
        iframe.style.height = '800px';
      }
    };
  }
}
```

## 📱 Mobile Optimization

### Mobile-First Approach
```html
<div class="mobile-optimized-embed">
  <iframe 
    src="https://your-domain.com/index.html"
    width="100%"
    height="600"
    frameborder="0"
    scrolling="auto">
  </iframe>
</div>

<style>
@media (max-width: 480px) {
  .mobile-optimized-embed iframe {
    height: 500px;
  }
}

@media (min-width: 768px) {
  .mobile-optimized-embed iframe {
    height: 800px;
  }
}

@media (min-width: 1024px) {
  .mobile-optimized-embed iframe {
    height: 900px;
  }
}
</style>
```

## 🛡️ Security Considerations

### CSP Headers
If you're embedding on a secure site, ensure these CSP headers:
```
Content-Security-Policy: frame-src https://your-domain.com;
X-Frame-Options: SAMEORIGIN
```

### HTTPS Only
Always use HTTPS URLs for embedding:
```html
<!-- ✅ Correct -->
<iframe src="https://your-domain.com/index.html"></iframe>

<!-- ❌ Incorrect -->
<iframe src="http://your-domain.com/index.html"></iframe>
```

## 📊 Tracking and Analytics

### Google Analytics Integration
```html
<script>
// Track iframe interactions
document.addEventListener('DOMContentLoaded', function() {
  const iframe = document.querySelector('iframe[src*="your-domain.com"]');
  if (iframe) {
    gtag('event', 'rwi_assessment_embed_view', {
      'event_category': 'engagement',
      'event_label': window.location.href
    });
  }
});
</script>
```

## 🎯 Best Practices

### 1. Performance Optimization
- Use `loading="lazy"` for iframe
- Set appropriate dimensions
- Include proper fallback content

### 2. User Experience
- Provide loading states
- Ensure mobile responsiveness
- Include proper error handling

### 3. SEO Considerations
- Use descriptive `title` attributes
- Include relevant surrounding content
- Consider iframe alternatives for critical content

## 🆘 Troubleshooting

### Common Issues:

#### 1. Iframe Not Loading
- Check HTTPS protocol
- Verify URL accessibility
- Check CSP headers

#### 2. Mobile Display Issues
- Test responsive breakpoints
- Adjust iframe dimensions
- Check viewport meta tag

#### 3. Cross-Origin Errors
- Use `postMessage` for communication
- Check frame-ancestors policy
- Verify domain configuration

## 📞 Support

For embedding support or custom integrations:

- **Email**: remoteworkingindonesia@gmail.com
- **Instagram**: @remoteworkingindonesia
- **Threads**: @remoteworkingindonesia

## 📝 Updates

This embedding guide will be updated as new platforms and features are supported. Check back regularly for the latest integration methods.

---

**💡 Pro Tip**: For best results, test your embed on multiple devices and browsers before going live!