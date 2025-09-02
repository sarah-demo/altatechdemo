// AltaTech 網站互動效果 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // 確保所有圖片正常顯示
    function ensureImagesVisible() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            
            // 如果圖片尚未載入，等待載入完成
            if (!img.complete) {
                img.onload = function() {
                    this.style.opacity = '1';
                    this.style.visibility = 'visible';
                };
                img.onerror = function() {
                    console.warn('圖片載入失敗:', this.src);
                };
            }
        });
    }
    
    // 滾動時導航列背景變化效果
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar1_component');
        if (!navbar) return;
        
        let scrolled = false;
        
        window.addEventListener('scroll', function() {
            const shouldScroll = window.scrollY > 50;
            
            if (shouldScroll && !scrolled) {
                navbar.classList.add('scrolled');
                scrolled = true;
            } else if (!shouldScroll && scrolled) {
                navbar.classList.remove('scrolled');
                scrolled = false;
            }
        });
    }
    
    // 滾動觸發淡入動畫
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);
        
        const elements = document.querySelectorAll('.fade-in-element');
        elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // 表單提交處理
    function initFormHandling() {
        const form = document.getElementById('contact-form');
        const submitButton = form?.querySelector('.submit-button');
        const successMessage = document.querySelector('.w-form-done');
        const errorMessage = document.querySelector('.w-form-fail');
        
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 顯示載入狀態
            submitButton.classList.add('loading');
            const originalText = submitButton.textContent;
            submitButton.textContent = '提交中...';
            
            // 取得表單資料
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // 基本表單驗證
            if (!validateForm(data)) {
                showErrorMessage('請填寫所有必填欄位');
                resetSubmitButton();
                return;
            }
            
            // 模擬提交過程
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                resetSubmitButton();
            }, 2000);
            
            function resetSubmitButton() {
                submitButton.classList.remove('loading');
                submitButton.textContent = originalText;
            }
        });
        
        function validateForm(data) {
            return data.name && data.email && data.phone && data.message;
        }
        
        function showSuccessMessage() {
            hideMessages();
            successMessage.style.display = 'block';
            setTimeout(() => successMessage.classList.add('show'), 100);
        }
        
        function showErrorMessage(message) {
            hideMessages();
            if (errorMessage.querySelector('div')) {
                errorMessage.querySelector('div').textContent = message;
            }
            errorMessage.style.display = 'block';
            setTimeout(() => errorMessage.classList.add('show'), 100);
        }
        
        function hideMessages() {
            successMessage?.classList.remove('show');
            errorMessage?.classList.remove('show');
            setTimeout(() => {
                if (successMessage) successMessage.style.display = 'none';
                if (errorMessage) errorMessage.style.display = 'none';
            }, 300);
        }
    }
    
    // 平滑滾動到錨點
    function initSmoothScroll() {
        // 暫時停用自訂滾動功能以避免與 Webflow 衝突
        console.log('Smooth scroll disabled to prevent conflicts with Webflow');
        return;
        
        const links = document.querySelectorAll('a[href^="#"]:not(.w-nav-link)');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 100;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 按鈕點擊波紋效果
    function initButtonRipple() {
        const buttons = document.querySelectorAll('.button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 10;
                `;
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // 添加波紋動畫CSS
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 初始化所有效果
    function init() {
        // 首先確保圖片可見
        ensureImagesVisible();
        
        // 等待 Webflow 初始化後再執行自訂效果
        setTimeout(() => {
            initNavbarScroll();
            initScrollAnimations();
            initFormHandling();
            initSmoothScroll();
            initButtonRipple();
        }, 500); // 增加延遲確保 Webflow 完全載入
        
        console.log('AltaTech 互動效果已載入');
    }
    
    // 等待 DOM 和 Webflow 完全載入
    if (window.Webflow) {
        init();
    } else {
        // 如果 Webflow 還未載入，延遲執行
        setTimeout(init, 1000);
    }
    
    // 監聽窗口載入完成，再次確保圖片顯示
    window.addEventListener('load', function() {
        ensureImagesVisible();
    });
});

// 檢測是否為觸控裝置
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// 針對觸控裝置調整效果
if (isTouchDevice()) {
    document.documentElement.classList.add('touch-device');
}

//隱私權彈窗
document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('privacyAccepted')) {
    document.getElementById('privacy-popup').style.display = 'block';
  }
  document.getElementById('privacy-close').onclick = function() {
    localStorage.setItem('privacyAccepted', 'yes');
    document.getElementById('privacy-popup').style.display = 'none';
  }
});

// 強制修復滾動條問題
function forceFixScrollbars() {
  // 移除html和body的滾動條
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  
  // 設置頁面包裝器滾動
  const pageWrapper = document.querySelector('.page-wrapper');
  if (pageWrapper) {
    pageWrapper.style.overflowY = 'auto';
    pageWrapper.style.overflowX = 'hidden';
    pageWrapper.style.height = '100vh';
    pageWrapper.style.maxWidth = '100vw';
  }
  
  // 檢查所有可能超寬的元素
  const elements = document.querySelectorAll('*');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width > window.innerWidth) {
      el.style.maxWidth = '100vw';
      el.style.overflow = 'hidden';
      console.log('Fixed overwide element:', el);
    }
  });
}

// 頁面載入後執行 - 暫時註解掉因為可能影響顯示
// document.addEventListener('DOMContentLoaded', forceFixScrollbars);
// window.addEventListener('load', forceFixScrollbars);
// window.addEventListener('resize', forceFixScrollbars);
