// Generated by CoffeeScript 1.7.1
var CACHE_RETRY_TIMEOUT, Cache, ResourceCacheEntry, ResourceWriteQueue;

CACHE_RETRY_TIMEOUT = 60000;

ResourceCacheEntry = require('./resource_cache_entry');

Cache = require('./cache');

ResourceWriteQueue = (function() {
  function ResourceWriteQueue(CachedResource, $timeout) {
    this.CachedResource = CachedResource;
    this.$timeout = $timeout;
    this.key = "" + this.CachedResource.$key + "/write";
    this.queue = Cache.getItem(this.key, []);
  }

  ResourceWriteQueue.prototype.enqueue = function(params, action, deferred) {
    var entry, _ref, _ref1;
    entry = this.findEntry({
      params: params,
      action: action
    });
    if (entry == null) {
      this.queue.push({
        params: params,
        action: action,
        deferred: deferred
      });
      return this._update();
    } else {
      if ((_ref = entry.deferred) != null) {
        _ref.promise.then(function(response) {
          return deferred.resolve(response);
        });
      }
      return (_ref1 = entry.deferred) != null ? _ref1.promise["catch"](function(error) {
        return deferred.reject(error);
      }) : void 0;
    }
  };

  ResourceWriteQueue.prototype.findEntry = function(_arg) {
    var action, entry, params, _i, _len, _ref;
    action = _arg.action, params = _arg.params;
    _ref = this.queue;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      if (action === entry.action && angular.equals(params, entry.params)) {
        return entry;
      }
    }
  };

  ResourceWriteQueue.prototype.removeEntry = function(_arg) {
    var action, entry, newQueue, params, _i, _len, _ref;
    action = _arg.action, params = _arg.params;
    newQueue = [];
    _ref = this.queue;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      if (!(action === entry.action && angular.equals(params, entry.params))) {
        newQueue.push(entry);
      }
    }
    this.queue = newQueue;
    if (this.queue.length === 0 && this.timeoutPromise) {
      this.$timeout.cancel(this.timeoutPromise);
      delete this.timeoutPromise;
    }
    return this._update();
  };

  ResourceWriteQueue.prototype.flush = function() {
    var entry, _i, _len, _ref, _results;
    this._setFlushTimeout();
    _ref = this.queue;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      _results.push(this._processEntry(entry));
    }
    return _results;
  };

  ResourceWriteQueue.prototype.processResource = function(params, done) {
    var entry, notDone, _i, _len, _ref, _results;
    notDone = true;
    _ref = this._entriesForResource(params);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      _results.push(this._processEntry(entry, (function(_this) {
        return function() {
          if (notDone && _this._entriesForResource(params).length === 0) {
            notDone = false;
            return done();
          }
        };
      })(this)));
    }
    return _results;
  };

  ResourceWriteQueue.prototype._entriesForResource = function(params) {
    var entry, _i, _len, _ref, _results;
    _ref = this.queue;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      if (angular.equals(params, entry.params)) {
        _results.push(entry);
      }
    }
    return _results;
  };

  ResourceWriteQueue.prototype._processEntry = function(entry, done) {
    var cacheEntry, onFailure, onSuccess;
    cacheEntry = new ResourceCacheEntry(this.CachedResource.$key, entry.params);
    onSuccess = (function(_this) {
      return function(value) {
        var _ref;
        _this.removeEntry(entry);
        cacheEntry.setClean();
        if ((_ref = entry.deferred) != null) {
          _ref.resolve(value);
        }
        if (angular.isFunction(done)) {
          return done();
        }
      };
    })(this);
    onFailure = (function(_this) {
      return function(error) {
        var _ref;
        return (_ref = entry.deferred) != null ? _ref.reject(error) : void 0;
      };
    })(this);
    return this.CachedResource.$resource[entry.action](entry.params, cacheEntry.value, onSuccess, onFailure);
  };

  ResourceWriteQueue.prototype._setFlushTimeout = function() {
    if (this.queue.length > 0 && !this.timeoutPromise) {
      this.timeoutPromise = this.$timeout(angular.bind(this, this.flush), CACHE_RETRY_TIMEOUT);
      return this.timeoutPromise.then((function(_this) {
        return function() {
          delete _this.timeoutPromise;
          return _this._setFlushTimeout();
        };
      })(this));
    }
  };

  ResourceWriteQueue.prototype._update = function() {
    var savableQueue;
    savableQueue = this.queue.map(function(entry) {
      return {
        params: entry.params,
        action: entry.action
      };
    });
    return Cache.setItem(this.key, savableQueue);
  };

  return ResourceWriteQueue;

})();

module.exports = ResourceWriteQueue;
