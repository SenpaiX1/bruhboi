// Yandex Games SDK Stub for Local Development
// This file replaces the real SDK when running locally to prevent ad-related errors

(function() {
  'use strict';
  
  console.log('%c[SDK Stub] Running in local mode - Yandex SDK mocked', 'color: #4CAF50; font-weight: bold; background: #1a1a1a; padding: 4px 8px;');

  var ysdkStub = {
    environment: {
      i18n: { lang: 'en', tld: 'com' },
      app: { id: 'local-dev' },
      browser: { lang: 'en' },
      payload: ''
    },

    features: {
      LoadingAPI: {
        ready: function() {
          console.log('[SDK Stub] LoadingAPI.ready() called');
        }
      },
      GamesAPI: {
        getAllGames: function() {
          return Promise.resolve({ games: [], developerURL: '' });
        }
      }
    },

    getPlayer: function(options) {
      console.log('[SDK Stub] getPlayer() called');
      return Promise.resolve({
        getMode: function() { return 'lite'; },
        getName: function() { return 'LocalPlayer'; },
        getPhoto: function(size) { return ''; },
        getUniqueID: function() { return 'local_' + Date.now(); },
        setData: function(data, flush) { return Promise.resolve(); },
        getData: function(keys) { return Promise.resolve({}); },
        setStats: function(stats) { return Promise.resolve(); },
        getStats: function(keys) { return Promise.resolve({}); },
        incrementStats: function(increments) { return Promise.resolve({}); }
      });
    },

    getPayments: function(options) {
      console.log('[SDK Stub] PAYMENTS DISABLED - getPayments() called but payments are disabled');
      return Promise.resolve({
        getCatalog: function() { return Promise.resolve([]); },
        getPurchases: function() { return Promise.resolve([]); },
        purchase: function(options) { 
          console.log('[SDK Stub] purchase() called - PAYMENTS DISABLED, rejecting purchase');
          return Promise.reject(new Error('Payments are disabled for local testing')); 
        },
        consumePurchase: function(purchaseToken) { return Promise.resolve(); }
      });
    },

    adv: {
      showFullscreenAdv: function(options) {
        console.log('[SDK Stub] showFullscreenAdv() called - skipping ad');
        if (options && options.callbacks) {
          setTimeout(function() {
            if (options.callbacks.onClose) options.callbacks.onClose(false);
          }, 100);
        }
      },
      showRewardedVideo: function(options) {
        console.log('[SDK Stub] showRewardedVideo() called - granting reward');
        if (options && options.callbacks) {
          setTimeout(function() {
            if (options.callbacks.onRewarded) options.callbacks.onRewarded();
            if (options.callbacks.onClose) options.callbacks.onClose(true);
          }, 100);
        }
      },
      showBannerAdv: function() {
        console.log('[SDK Stub] showBannerAdv() called - banner simulated');
        return Promise.resolve();
      },
      hideBannerAdv: function() {
        console.log('[SDK Stub] hideBannerAdv() called - banner hidden');
        return Promise.resolve();
      },
      getBannerAdvStatus: function() {
        console.log('[SDK Stub] getBannerAdvStatus() called');
        return Promise.resolve({
          stickyAdvIsShowing: false,
          reason: 'UNKNOWN'
        });
      }
    },

    sound: {
      start: function() {
        console.log('[SDK Stub] sound.start() called');
      },
      stop: function() {
        console.log('[SDK Stub] sound.stop() called');
      }
    },

    auth: {
      openAuthDialog: function() {
        console.log('[SDK Stub] openAuthDialog() called');
        return Promise.resolve();
      }
    },

    leaderboards: {
      getDescription: function(leaderboardName) {
        return Promise.resolve({
          appID: 'local-dev',
          default: true,
          description: { invert_sort_order: false, score_format: { options: { decimal_offset: 0 } }, type: 'numeric' },
          name: leaderboardName,
          title: { en: leaderboardName }
        });
      },
      setScore: function(leaderboardName, score, extraData) {
        console.log('[SDK Stub] setScore() called:', leaderboardName, score);
        return Promise.resolve();
      },
      getEntries: function(leaderboardName, options) {
        console.log('[SDK Stub] getEntries() called:', leaderboardName);
        return Promise.resolve({
          leaderboard: { name: leaderboardName },
          ranges: [],
          userRank: 0,
          entries: []
        });
      }
    },

    feedback: {
      canReview: function() {
        return Promise.resolve({ value: false, reason: 'NO_AUTH' });
      },
      requestReview: function() {
        return Promise.resolve({ feedbackSent: false });
      }
    },

    shortcut: {
      canShowPrompt: function() {
        return Promise.resolve({ canShow: false });
      },
      showPrompt: function() {
        return Promise.resolve({ outcome: 'rejected' });
      }
    },

    deviceInfo: {
      type: 'desktop',
      isDesktop: function() { return true; },
      isMobile: function() { return false; },
      isTablet: function() { return false; },
      isTV: function() { return false; }
    },

    clipboard: {
      writeText: function(text) {
        console.log('[SDK Stub] clipboard.writeText() called');
        return Promise.resolve();
      }
    },

    serverTime: function() {
      return Date.now();
    },

    on: function(event, callback) {
      console.log('[SDK Stub] on() event registered:', event);
    },
    
    off: function(event, callback) {
      console.log('[SDK Stub] off() event unregistered:', event);
    },

    screen: {
      fullscreen: {
        request: function() {
          console.log('[SDK Stub] screen.fullscreen.request() called');
          return Promise.resolve();
        },
        exit: function() {
          console.log('[SDK Stub] screen.fullscreen.exit() called');
          return Promise.resolve();
        },
        status: 'off'
      }
    },

    safeStorage: {
      getItem: function(key) {
        console.log('[SDK Stub] safeStorage.getItem() called:', key);
        return Promise.resolve(null);
      },
      setItem: function(key, value) {
        console.log('[SDK Stub] safeStorage.setItem() called:', key);
        return Promise.resolve();
      },
      removeItem: function(key) {
        console.log('[SDK Stub] safeStorage.removeItem() called:', key);
        return Promise.resolve();
      }
    },

    playerAccount: {
      getCloudSaveData: function() {
        console.log('[SDK Stub] playerAccount.getCloudSaveData() called');
        return Promise.resolve({ data: {} });
      },
      setCloudSaveData: function(data) {
        console.log('[SDK Stub] playerAccount.setCloudSaveData() called');
        return Promise.resolve();
      }
    },

    getFlags: function(params) {
      console.log('[SDK Stub] getFlags() called');
      return Promise.resolve({});
    },

    isAvailableMethod: function(methodName) {
      return true;
    }
  };

  window.ysdk = ysdkStub;

  window.YaGames = {
    init: function(options) {
      console.log('[SDK Stub] YaGames.init() called');
      return Promise.resolve(ysdkStub);
    }
  };

  console.log('[SDK Stub] Initialization complete - ysdk and YaGames are now available globally');
})();
