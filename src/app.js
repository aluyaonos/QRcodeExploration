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
  const rateValue = document.getElementById('rate-value');
  const copyButton = document.getElementById('copy-button');

  const assetPlaceholderIcon = document.getElementById('asset-placeholder-icon');
  const networkPlaceholderIcon = document.getElementById('network-placeholder-icon');

  const qrSection = document.getElementById('qr-section');
  const ctaButton = document.getElementById('cta-button');

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
      addressValue.classList.add('loading');
      setTimeout(function () {
        addressValue.textContent = newAddress;
        addressValue.classList.remove('loading');
      }, 600);
    }

    // Update QR center icon
    qrNetworkIcon.src = QR_ICONS[selectedNetwork];
    qrNetworkIcon.alt = selectedNetwork;

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
