// Monieverse QR Code — Receive USD Screen

(function () {
  'use strict';

  // ---- Mock Data ----
  const ADDRESSES = {
    'USDT-Ethereum':   '0xf7834K...783JA83',
    'USDT-BNB Smart Chain': '0xaB92cD...4F1eE72',
    'USDT-Polygon':    '0x3eD81A...9c7bF05',
    'USDT-Ton':        'UQBv8k...X3pR9a',
    'USDC-Ethereum':   '0xd4E56F...12Ab9C3',
    'USDC-BNB Smart Chain': '0x7Fa31B...8dC2e91',
    'USDC-Polygon':    '0x91cBa7...5eF3d82',
    'USDC-Ton':        'EQCm7j...W2qN4b',
  };

  const FULL_ADDRESSES = {
    'USDT-Ethereum':   '0xf7834K92a1bC5d6E8f0A3B7c4D9e2F1783JA83',
    'USDT-BNB Smart Chain': '0xaB92cDe3f4A5b6C7d8E9F0a1B2c3D4F1eE72',
    'USDT-Polygon':    '0x3eD81Af2b3C4d5E6f7A8B9c0D1e2F39c7bF05',
    'USDT-Ton':        'UQBv8kLm3nO4pQ5rS6tU7vW8xY9zA1bC2dX3pR9a',
    'USDC-Ethereum':   '0xd4E56Fa7b8C9d0E1f2A3B4c5D6e7F812Ab9C3',
    'USDC-BNB Smart Chain': '0x7Fa31Be2c3D4e5F6a7B8c9D0e1F2a38dC2e91',
    'USDC-Polygon':    '0x91cBa7d8E9f0A1b2C3d4E5f6A7b8C95eF3d82',
    'USDC-Ton':        'EQCm7jK8lN9oP0qR1sT2uV3wX4yZ5aB6cW2qN4b',
  };

  const QR_ICONS = {
    'Ethereum':        'src/assets/svg/QR Code - Eth.svg',
    'BNB Smart Chain': 'src/assets/svg/QR Code - BSC.svg',
    'Polygon':         'src/assets/svg/QR Code - Polygon.svg',
    'Ton':             'src/assets/svg/QR Code - Ton.svg',
  };

  // ---- State ----
  let selectedAsset = null;
  let selectedNetwork = null;

  // ---- DOM Refs ----
  const assetDropdown = document.getElementById('asset-dropdown');
  const assetMenu = document.getElementById('asset-menu');
  const assetIcon = document.getElementById('asset-icon');
  const assetText = document.getElementById('asset-text');

  const networkDropdown = document.getElementById('network-dropdown');
  const networkMenu = document.getElementById('network-menu');
  const networkIcon = document.getElementById('network-icon');
  const networkText = document.getElementById('network-text');

  const qrNetworkIcon = document.getElementById('qr-network-icon');
  const addressValue = document.getElementById('address-value');
  const addressLoader = document.getElementById('address-loader');
  const rateValue = document.getElementById('rate-value');
  const copyButton = document.getElementById('copy-button');

  const assetPlaceholderIcon = document.getElementById('asset-placeholder-icon');
  const networkPlaceholderIcon = document.getElementById('network-placeholder-icon');

  const qrSection = document.getElementById('qr-section');
  const ctaButton = document.getElementById('cta-button');

  // Step 2 DOM refs
  var stepperStep1      = document.getElementById('stepper-step-1');
  var stepperStep2      = document.getElementById('stepper-step-2');
  var stepCurrent       = document.getElementById('step-current');
  var headerBar         = document.getElementById('header-bar');
  var headerCenterText  = document.getElementById('header-center-text');
  var headerAmountDisplay = document.getElementById('header-amount-display');
  var step1Inner        = document.getElementById('step-1-inner');
  var step2Inner        = document.getElementById('step-2-inner');
  var s2Actions         = document.getElementById('s2-actions');
  var s2AssetSuffix     = document.getElementById('s2-asset-suffix');
  var s2AmountInput     = document.getElementById('s2-amount-input');
  var s2TxidInput       = document.getElementById('s2-txid-input');
  var s2PasteBtn        = document.getElementById('s2-paste-btn');
  var s2BackBtn         = document.getElementById('s2-back-btn');

  // ---- QR SVG (fetched and inlined so path elements are animatable) ----
  var qrContainer = document.getElementById('qr-svg-container');
  var qrSvg = null;

  fetch('src/assets/svg/QR Code.svg')
    .then(function (r) { return r.text(); })
    .then(function (svgText) {
      qrContainer.innerHTML = svgText;
      qrSvg = qrContainer.querySelector('svg');
      qrSvg.setAttribute('width', '100%');
      qrSvg.setAttribute('height', '100%');
    });

  // ---- QR Wave Animation (colour wave through existing SVG paths — no movement, no extra elements) ----
  var waveAnimId = 0;

  function triggerQRWave() {
    if (!qrSvg) return;

    // Cancel any in-progress animation before starting a new one
    var currentId = ++waveAnimId;

    var paths = Array.from(qrSvg.querySelectorAll('path'));
    var vbCx = 120;
    var vbCy = 120;
    var maxDist = Math.sqrt(120 * 120 + 120 * 120); // ≈ 169.7

    // ---- Classify finder-pattern (eye) paths ----
    // Uses absolute SVG coordinates derived from the actual finder path geometry:
    //   Top-left  outer rect: x 18–61, y 18–61  → centre ≈ (40, 40)
    //   Top-right outer rect: x 178–221, y 18–61 → centre ≈ (200, 40)
    //   Bottom-left outer rect: x 18–61, y 178–221 → centre ≈ (40, 200)
    // Data modules adjacent to finders start at x/y ≈ 67, so a boundary of
    // < 65 / > 175 cleanly isolates the three finder paths with no leakage.
    var allModules = paths.map(function (path) {
      var bbox = path.getBBox();
      var cx   = bbox.x + bbox.width  / 2;
      var cy   = bbox.y + bbox.height / 2;
      var dist = Math.sqrt(Math.pow(cx - vbCx, 2) + Math.pow(cy - vbCy, 2));
      var isEye = (cx < 65  && cy < 65)  ||   // top-left finder
                  (cx > 175 && cy < 65)  ||   // top-right finder
                  (cx < 65  && cy > 175);     // bottom-left finder
      return { el: path, delay: (dist / maxDist) * 800, dur: 1000, isEye: isEye };
    });

    var eyeModules  = allModules.filter(function (m) { return  m.isEye; });
    var waveModules = allModules.filter(function (m) { return !m.isEye; });

    var EYE_TRIGGER_AT = 580;  // ms — trigger point for eye click animation

    // Setup scale-transform properties on wave modules once (each path scales around its own centre)
    waveModules.forEach(function (m) {
      m.el.style.transformBox    = 'fill-box';
      m.el.style.transformOrigin = 'center center';
    });

    var startTime       = performance.now();
    var eyeAnimStarted  = false;

    // ---- Phase 1: Wave (non-eye modules only) ----
    function frame(now) {
      if (waveAnimId !== currentId) {
        waveModules.forEach(function (m) {
          m.el.style.fill            = '';
          m.el.style.transform       = '';
          m.el.style.transformBox    = '';
          m.el.style.transformOrigin = '';
        });
        return;
      }

      var elapsed   = now - startTime;
      var waveAlive = false;

      // 4-stop colour curve (eye modules untouched — wave passes underneath them):
      //  0.000 → 0.304 : dark → #BBC0CA   (leading edge, soft ramp in)
      //  0.304 → 0.634 : #BBC0CA → #745DEF (peak ring)
      //  0.634 → 0.938 : #745DEF → dark    (trailing edge, symmetric soft ramp out)
      //  > 0.938        : snap to dark, done
      for (var i = 0; i < waveModules.length; i++) {
        var m      = waveModules[i];
        var localT = elapsed - m.delay;

        if (localT < 0) { waveAlive = true; continue; }

        var progress = localT / m.dur;

        if (progress > 0.938) {
          m.el.style.fill      = '#1A1A21'; // snap to dark
          m.el.style.transform = '';        // restore full scale
          continue;
        }

        waveAlive = true;

        var r, g, b, t;
        if (progress <= 0.304) {
          t = progress / 0.304;
          r = Math.round(26  + t * (187 - 26));  // peak: #BBC0CA
          g = Math.round(26  + t * (192 - 26));
          b = Math.round(33  + t * (202 - 33));
        } else if (progress <= 0.634) {
          t = (progress - 0.304) / 0.330;
          r = Math.round(187 + t * (116 - 187));  // #BBC0CA → #745DEF
          g = Math.round(192 + t * (93  - 192));
          b = Math.round(202 + t * (239 - 202));
        } else {
          t = (progress - 0.634) / 0.304;
          r = Math.round(116 + t * (26  - 116));  // #745DEF → dark (soft, mirrors leading ramp)
          g = Math.round(93  + t * (26  - 93));
          b = Math.round(239 + t * (33  - 239));
        }
        m.el.style.fill = 'rgb(' + r + ',' + g + ',' + b + ')';

        // Scale: squeeze in during grey wave, burst back as purple ring passes
        //  progress 0.000–0.250 : 1.0 → 0.1  (ease-in squeeze as grey wave arrives)
        //  progress 0.250–0.380 : 0.1 → 0.5  (first half of purple, scale rises)
        //  progress 0.380–0.510 : 0.5 → 1.0  (second half of purple, ease-out spring back)
        //  progress > 0.510     : 1.0          (hold at full size for trailing dark fade)
        var scale;
        if (progress <= 0.250) {
          var st = progress / 0.250; st = st * st;  // ease-in
          scale = 1.0 - 0.9 * st;                   // 1.0 → 0.1
        } else if (progress <= 0.380) {
          var st = (progress - 0.250) / 0.130;
          scale = 0.1 + 0.4 * st;                   // 0.1 → 0.5
        } else if (progress <= 0.510) {
          var st = (progress - 0.380) / 0.130;
          st = 1 - (1 - st) * (1 - st);             // ease-out
          scale = 0.5 + 0.5 * st;                   // 0.5 → 1.0
        } else {
          scale = 1;
        }
        m.el.style.transform = 'scale(' + scale.toFixed(3) + ')';
      }

      // Trigger eye animation when wave is ~65% complete
      if (!eyeAnimStarted && elapsed >= EYE_TRIGGER_AT) {
        eyeAnimStarted = true;
        startEyeAnimation();
      }

      if (waveAlive) {
        requestAnimationFrame(frame);
      } else {
        // Wave done — clear all wave module styles (fill + scale transform)
        waveModules.forEach(function (m) {
          m.el.style.fill            = '';
          m.el.style.transform       = '';
          m.el.style.transformBox    = '';
          m.el.style.transformOrigin = '';
        });
      }
    }

    // ---- Phase 2: Eye click + colour animation (starts at 65% of wave) ----
    // Colour: ease-in dark → #745DEF, ease-out #745DEF → dark
    // Scale:  ease-in 1.0 → 0.8 (click down), ease-out 0.8 → 1.0 (spring back)
    // transform-box: fill-box + transform-origin: center makes each path scale
    // around its own bounding-box centre — both outer rect and inner circle share
    // the same centre so the whole finder shrinks as one unit.
    function startEyeAnimation() {
      if (waveAnimId !== currentId) return;

      var PHASE_IN      = 120;   // ms — shared ease-in for both colour and scale
      var COLOUR_HOLD   = 1000;  // ms — colour holds peak purple until 1000ms (50% of 2000ms)
      var COLOUR_END    = 2000;  // ms — colour ease-out finishes at 2000ms
      var SCALE_END     = 300;   // ms — scale (click) animation finishes at 300ms
      var TOTAL_DUR     = 2000;  // ms — overall animation lifetime

      // Prepare transform properties once
      eyeModules.forEach(function (m) {
        m.el.style.transformBox    = 'fill-box';
        m.el.style.transformOrigin = 'center center';
      });

      var animStart = performance.now();

      function animFrame(now) {
        if (waveAnimId !== currentId) {
          eyeModules.forEach(function (m) {
            m.el.style.fill            = '';
            m.el.style.transform       = '';
            m.el.style.transformBox    = '';
            m.el.style.transformOrigin = '';
          });
          return;
        }

        var elapsed = now - animStart;

        if (elapsed >= TOTAL_DUR) {
          eyeModules.forEach(function (m) {
            m.el.style.fill            = '';
            m.el.style.transform       = '';
            m.el.style.transformBox    = '';
            m.el.style.transformOrigin = '';
          });
          return;
        }

        // ---- Colour (purple): ease-in → hold → ease-out ----
        var intensity;
        if (elapsed < PHASE_IN) {
          var ct  = elapsed / PHASE_IN;
          ct      = ct * ct;                                        // ease-in
          intensity = ct;
        } else if (elapsed < COLOUR_HOLD) {
          intensity = 1;                                            // hold at peak
        } else {
          var ct  = (elapsed - COLOUR_HOLD) / (COLOUR_END - COLOUR_HOLD);
          ct      = 1 - (1 - ct) * (1 - ct);                      // ease-out
          intensity = 1 - ct;
        }

        // ---- Scale (click): ease-in → ease-out, completes at SCALE_END ----
        var scale;
        if (elapsed < PHASE_IN) {
          var st  = elapsed / PHASE_IN;
          st      = st * st;                                        // ease-in
          scale   = 1 - 0.20 * st;                                 // 1.0 → 0.8
        } else if (elapsed < SCALE_END) {
          var st  = (elapsed - PHASE_IN) / (SCALE_END - PHASE_IN);
          st      = 1 - (1 - st) * (1 - st);                      // ease-out
          scale   = 0.80 + 0.20 * st;                             // 0.8 → 1.0
        } else {
          scale   = 1;                                              // scale done
        }

        var er   = Math.round(26 + intensity * (116 - 26));  // #745DEF
        var eg   = Math.round(26 + intensity * (93  - 26));
        var eb   = Math.round(33 + intensity * (239 - 33));
        var fill = intensity > 0.001 ? 'rgb(' + er + ',' + eg + ',' + eb + ')' : '#1A1A21';

        eyeModules.forEach(function (m) {
          m.el.style.fill      = fill;
          m.el.style.transform = 'scale(' + scale + ')';
        });

        requestAnimationFrame(animFrame);
      }

      requestAnimationFrame(animFrame);
    }

    requestAnimationFrame(frame);
  }

  // ---- Update UI ----
  function updateUI() {
    var bothSelected = selectedAsset && selectedNetwork;

    // Show/hide QR section
    if (bothSelected) {
      qrSection.classList.remove('hidden');
      ctaButton.classList.remove('disabled');
      ctaButton.disabled = false;
    } else {
      qrSection.classList.add('hidden');
      ctaButton.classList.add('disabled');
      ctaButton.disabled = true;
    }

    if (!bothSelected) return;

    var key = selectedAsset + '-' + selectedNetwork;

    // Update address with skeleton loader
    var newAddress = ADDRESSES[key] || '0x0000...0000';
    if (addressValue.textContent !== newAddress) {
      addressLoader.classList.add('visible');
      setTimeout(function () {
        addressValue.textContent = newAddress;
        addressLoader.classList.remove('visible');
      }, 900);
    }

    // Update QR center icon with fade ease-in/ease-out transition
    var prevSrc = qrNetworkIcon.getAttribute('src');
    var newSrc = QR_ICONS[selectedNetwork];

    if (prevSrc !== newSrc) {
      qrNetworkIcon.style.opacity = '0';
      setTimeout(function () {
        qrNetworkIcon.src = newSrc;
        qrNetworkIcon.alt = selectedNetwork;
        qrNetworkIcon.style.opacity = '1';
      }, 180); // matches CSS transition duration
      triggerQRWave();
    }

    // Update rate
    rateValue.textContent = '1 ' + selectedAsset + ' = $0.98';
  }

  // ---- Dropdown Logic ----
  function setupDropdown(trigger, menu, onSelect) {
    // Toggle open
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');

      // Close all dropdowns first
      closeAllDropdowns();

      if (!isOpen) {
        menu.classList.add('open');
        trigger.classList.add('open');
      }
    });

    // Option selection
    menu.querySelectorAll('.dropdown-option').forEach(function (option) {
      option.addEventListener('click', function (e) {
        e.stopPropagation();
        const value = option.dataset.value;
        const icon = option.dataset.icon;

        // Update selected state
        menu.querySelectorAll('.dropdown-option').forEach(function (o) {
          o.classList.remove('selected');
        });
        option.classList.add('selected');

        // Close dropdown
        menu.classList.remove('open');
        trigger.classList.remove('open');

        onSelect(value, icon, option);
      });
    });
  }

  function closeAllDropdowns() {
    [assetMenu, networkMenu].forEach(function (menu) {
      menu.classList.remove('open');
    });
    [assetDropdown, networkDropdown].forEach(function (trigger) {
      trigger.classList.remove('open');
    });
  }

  // Close on outside click
  document.addEventListener('click', closeAllDropdowns);

  // Asset dropdown
  setupDropdown(assetDropdown, assetMenu, function (value, icon) {
    selectedAsset = value;
    assetText.textContent = value;
    assetText.classList.remove('placeholder');
    assetPlaceholderIcon.classList.add('hidden');
    assetIcon.classList.remove('hidden');
    assetIcon.src = icon;
    assetIcon.alt = value;
    updateUI();
  });

  // Network dropdown
  setupDropdown(networkDropdown, networkMenu, function (value, icon) {
    selectedNetwork = value;
    networkText.textContent = value;
    networkText.classList.remove('placeholder');
    networkPlaceholderIcon.classList.add('hidden');
    networkIcon.classList.remove('hidden');
    networkIcon.src = icon;
    networkIcon.alt = value;
    updateUI();
  });

  // ---- Custom Scrollbar ----
  var cardScroll = document.querySelector('.card-scroll');
  var scrollThumb = document.getElementById('custom-scrollbar-thumb');
  var scrollTrack = document.getElementById('custom-scrollbar');
  var scrollHideTimer = null;
  var THUMB_HEIGHT = 80;
  var TRACK_INSET = 140;

  scrollThumb.style.height = THUMB_HEIGHT + 'px';

  function updateScrollThumb() {
    var el = cardScroll;
    var scrollableHeight = el.scrollHeight - el.clientHeight;
    if (scrollableHeight <= 0) {
      scrollThumb.classList.remove('visible');
      return;
    }
    var trackHeight = scrollTrack.clientHeight - TRACK_INSET * 2;
    var maxTop = trackHeight - THUMB_HEIGHT;
    var ratio = el.scrollTop / scrollableHeight;
    var top = TRACK_INSET + ratio * maxTop;
    scrollThumb.style.top = top + 'px';

    scrollThumb.classList.add('visible');
    clearTimeout(scrollHideTimer);
    scrollHideTimer = setTimeout(function () {
      scrollThumb.classList.remove('visible');
    }, 1200);
  }

  cardScroll.addEventListener('scroll', updateScrollThumb);

  // Drag support
  var isDragging = false;
  var dragStartY = 0;
  var dragStartScroll = 0;

  scrollThumb.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragStartY = e.clientY;
    dragStartScroll = cardScroll.scrollTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var trackHeight = scrollTrack.clientHeight - TRACK_INSET * 2;
    var maxTop = trackHeight - THUMB_HEIGHT;
    var scrollableHeight = cardScroll.scrollHeight - cardScroll.clientHeight;
    var dy = e.clientY - dragStartY;
    var scrollDelta = (dy / maxTop) * scrollableHeight;
    cardScroll.scrollTop = dragStartScroll + scrollDelta;
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });

  // ---- Step 2: Show confirmation page ----
  function showStep2() {
    // Stepper: step 1 → completed, step 2 → active
    stepperStep1.classList.remove('active');
    stepperStep1.classList.add('completed');
    stepperStep2.classList.remove('inactive');
    stepperStep2.classList.add('active');

    // Step counter
    stepCurrent.textContent = '2';

    // Progress bar 50% → 100%
    headerBar.classList.remove('step-1-return');
    headerBar.classList.add('step-2');

    // Header center text
    s2AssetSuffix.textContent = selectedAsset || 'USD';
    headerAmountDisplay.textContent = (s2AmountInput.value || '0') + ' ' + (selectedAsset || 'USD');
    headerCenterText.classList.remove('hidden');

    // Swap card content
    step1Inner.classList.add('hidden');
    step2Inner.classList.remove('hidden');

    // Swap footer buttons
    ctaButton.classList.add('hidden');
    s2Actions.classList.remove('hidden');

    // Scroll to top
    cardScroll.scrollTop = 0;
  }

  // ---- Step 1: Return to details page ----
  function showStep1() {
    // Stepper: step 1 → active, step 2 → inactive
    stepperStep1.classList.remove('completed');
    stepperStep1.classList.add('active');
    stepperStep2.classList.remove('active');
    stepperStep2.classList.add('inactive');

    // Step counter
    stepCurrent.textContent = '1';

    // Progress bar 100% → 50%
    headerBar.classList.remove('step-2');
    headerBar.classList.add('step-1-return');

    // Hide header center text
    headerCenterText.classList.add('hidden');

    // Swap card content
    step2Inner.classList.add('hidden');
    step1Inner.classList.remove('hidden');

    // Swap footer buttons
    s2Actions.classList.add('hidden');
    ctaButton.classList.remove('hidden');
  }

  // ---- CTA Button → Step 2 ----
  ctaButton.addEventListener('click', function () {
    if (!ctaButton.disabled) {
      showStep2();
    }
  });

  // ---- Back Button → Step 1 ----
  s2BackBtn.addEventListener('click', showStep1);

  // ---- Paste Button ----
  s2PasteBtn.addEventListener('click', function () {
    navigator.clipboard.readText().then(function (text) {
      s2TxidInput.value = text;
    }).catch(function () {});
  });

  // ---- Amount Input — comma formatting + header sync ----
  s2AmountInput.addEventListener('input', function () {
    var raw = this.value.replace(/,/g, '');          // strip existing commas
    var clean = raw.replace(/[^0-9.]/g, '');         // digits and decimal only

    // Allow only one decimal point
    var parts = clean.split('.');
    if (parts.length > 2) {
      clean = parts[0] + '.' + parts.slice(1).join('');
      parts = clean.split('.');
    }

    // Format integer part with thousand separators
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    this.value = parts.join('.');

    // Header sync uses the clean (unformatted) value
    headerAmountDisplay.textContent = (clean || '0') + ' ' + (selectedAsset || 'USD');
  });

  // ---- Copy Button ----
  copyButton.addEventListener('click', function () {
    const key = selectedAsset + '-' + selectedNetwork;
    const address = FULL_ADDRESSES[key] || '';

    navigator.clipboard.writeText(address).then(function () {
      var icon = copyButton.querySelector('i');
      icon.className = 'ph-fill ph-check-circle';
      icon.style.color = '#44CC8D';
      setTimeout(function () {
        icon.className = 'ph-fill ph-copy';
        icon.style.color = '';
      }, 1500);
    });
  });

})();
