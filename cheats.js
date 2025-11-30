// Secret Cheat System
// Activate with: Ctrl+Shift+C
(function() {
  'use strict';
  
  let cheatPanelVisible = false;
  
  // Listen for the cheat activation key combo (Ctrl+Shift+C)
  function handleKeyDown(event) {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
      event.stopPropagation();
      event.preventDefault();
      toggleCheatPanel();
    }
  }
  
  // Add listener to document - needed before Unity captures events
  document.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keydown', handleKeyDown, true);
  
  // Also try to add to canvas when it's ready
  function setupCanvasListener() {
    const canvas = document.getElementById('unityContainerCanvas');
    if (canvas) {
      canvas.addEventListener('keydown', handleKeyDown, true);
    } else {
      setTimeout(setupCanvasListener, 100);
    }
  }
  setupCanvasListener();
  
  function toggleCheatPanel() {
    const panelId = 'cheat-panel-container';
    let panel = document.getElementById(panelId);
    
    if (panel) {
      panel.remove();
      cheatPanelVisible = false;
      console.log('[CHEATS] Cheat panel hidden');
      return;
    }
    
    // Create cheat panel
    panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      background: rgba(0, 0, 0, 0.95);
      border: 3px solid #00FF00;
      border-radius: 8px;
      padding: 15px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      color: #00FF00;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    `;
    
    const titleContainer = document.createElement('div');
    titleContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      border-bottom: 2px solid #00FF00;
      padding-bottom: 8px;
    `;
    
    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 16px;
      font-weight: bold;
    `;
    title.textContent = '⚙️ CHEAT PANEL';
    titleContainer.appendChild(title);
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: rgba(255, 0, 0, 0.2);
      border: 1px solid #FF0000;
      color: #FF0000;
      font-weight: bold;
      cursor: pointer;
      width: 24px;
      height: 24px;
      padding: 0;
      border-radius: 3px;
      font-size: 14px;
      transition: all 0.2s;
    `;
    closeBtn.onmouseover = () => {
      closeBtn.style.background = 'rgba(255, 0, 0, 0.5)';
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.background = 'rgba(255, 0, 0, 0.2)';
    };
    closeBtn.onclick = () => {
      panel.remove();
      cheatPanelVisible = false;
      console.log('[CHEATS] Cheat panel closed');
    };
    titleContainer.appendChild(closeBtn);
    
    panel.appendChild(titleContainer);
    
    const cheats = [
      {
        label: 'Enable Payments',
        action: enablePayments
      },
      {
        label: 'Disable Payments',
        action: disablePayments
      },
      {
        label: 'Clear Cache',
        action: clearCache
      },
      {
        label: 'Copy Debug Info',
        action: copyDebugInfo
      }
    ];
    
    cheats.forEach(cheat => {
      const btn = document.createElement('button');
      btn.textContent = cheat.label;
      btn.style.cssText = `
        width: 100%;
        padding: 10px;
        margin: 8px 0;
        background: rgba(0, 255, 0, 0.1);
        border: 2px solid #00FF00;
        color: #00FF00;
        font-weight: bold;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        font-size: 12px;
      `;
      
      btn.onmouseover = () => {
        btn.style.background = 'rgba(0, 255, 0, 0.3)';
        btn.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
      };
      btn.onmouseout = () => {
        btn.style.background = 'rgba(0, 255, 0, 0.1)';
        btn.style.boxShadow = 'none';
      };
      
      btn.onclick = () => {
        cheat.action();
        console.log('[CHEATS] ' + cheat.label + ' executed');
      };
      
      panel.appendChild(btn);
    });
    
    document.body.appendChild(panel);
    cheatPanelVisible = true;
    console.log('[CHEATS] Cheat panel activated! Press Ctrl+Shift+C to hide');
  }
  
  function enablePayments() {
    window.paymentsEnabled = true;
    console.log('[CHEATS] Enabling payments...');
    
    // Override the cached payments object that the game is using
    if (window.payments) {
      console.log('[CHEATS] Found cached payments object, overriding purchase function');
      window.payments.purchase = function(options) { 
        console.log('[CHEATS] Purchase called - ENABLED, succeeding');
        return Promise.resolve({ purchaseToken: 'cheat_token_' + Date.now() }); 
      };
    }
    
    // Also override the SDK method for any future calls
    if (window.ysdk && window.ysdk.getPayments) {
      const original = window.ysdk.getPayments;
      window.ysdk.getPayments = function(options) {
        console.log('[CHEATS] getPayments called - returning enabled payments');
        return Promise.resolve({
          getCatalog: function() { return Promise.resolve([]); },
          getPurchases: function() { return Promise.resolve([]); },
          purchase: function(opts) { 
            console.log('[CHEATS] Purchase called - ENABLED');
            return Promise.resolve({ purchaseToken: 'cheat_token_' + Date.now() }); 
          },
          consumePurchase: function(purchaseToken) { return Promise.resolve(); }
        });
      };
    }
    alert('Payments enabled! Purchases will now succeed.');
  }
  
  function disablePayments() {
    window.paymentsEnabled = false;
    console.log('[CHEATS] Disabling payments...');
    
    // Override the cached payments object
    if (window.payments) {
      console.log('[CHEATS] Found cached payments object, overriding purchase function');
      window.payments.purchase = function(options) { 
        console.log('[CHEATS] Purchase called - DISABLED, rejecting');
        return Promise.reject(new Error('Payments disabled for testing')); 
      };
    }
    
    // Also override the SDK method
    if (window.ysdk && window.ysdk.getPayments) {
      window.ysdk.getPayments = function(options) {
        console.log('[CHEATS] getPayments called - returning disabled payments');
        return Promise.resolve({
          getCatalog: function() { return Promise.resolve([]); },
          getPurchases: function() { return Promise.resolve([]); },
          purchase: function(opts) { 
            console.log('[CHEATS] Purchase called - DISABLED');
            return Promise.reject(new Error('Payments disabled for testing')); 
          },
          consumePurchase: function(purchaseToken) { return Promise.resolve(); }
        });
      };
    }
    alert('Payments disabled!');
  }
  
  function clearCache() {
    if (window.indexedDB) {
      const dbs = ['UnityCache', 'UnityLoader'];
      dbs.forEach(dbName => {
        const req = indexedDB.deleteDatabase(dbName);
        req.onsuccess = () => console.log('[CHEATS] Deleted IndexedDB: ' + dbName);
        req.onerror = () => console.log('[CHEATS] Failed to delete ' + dbName);
      });
    }
    localStorage.clear();
    sessionStorage.clear();
    alert('Cache cleared! Page will reload...');
    setTimeout(() => location.reload(), 500);
  }
  
  function copyDebugInfo() {
    const info = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ysdkAvailable: !!window.ysdk,
      gameInstanceAvailable: !!window.myGameInstance,
      paymentsEnabled: window.paymentsEnabled || false
    };
    const text = JSON.stringify(info, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Debug info copied to clipboard!');
    } else {
      console.log('[CHEATS] Debug info:', info);
      alert('Check browser console for debug info');
    }
  }
  
  console.log('[CHEATS] Cheat system loaded. Press Ctrl+Shift+C to activate the panel');
  
  // Make it globally accessible for testing
  window.cheatSystem = {
    togglePanel: toggleCheatPanel,
    version: '1.0'
  };
  
  // Also log to make sure it loaded
  setTimeout(function() {
    console.log('[CHEATS] Ready - Try pressing Ctrl+Shift+C now');
  }, 500);
})();
