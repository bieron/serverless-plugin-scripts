'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scripts = function () {
  function Scripts(serverless) {
    _classCallCheck(this, Scripts);

    this.serverless = serverless;
    this.commands = {};
    this.hooks = {};

    this.defineCommands();
    this.defineHooks();
  }

  _createClass(Scripts, [{
    key: 'getConfig',
    value: function getConfig() {
      var service = this.serverless.service;
      return service.custom && service.custom.scripts;
    }
  }, {
    key: 'defineCommands',
    value: function defineCommands() {
      var config = this.getConfig();
      var commands = config && config.commands;
      if (!commands) return;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(commands)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var name = _step.value;

          if (!this.commands[name]) {
            this.commands[name] = { lifecycleEvents: [] };
          }
          this.commands[name].lifecycleEvents.push(name);

          this.hooks[name + ':' + name] = this.runCommand.bind(this, name);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'defineHooks',
    value: function defineHooks() {
      var config = this.getConfig();
      var hooks = config && config.hooks;
      if (!hooks) return;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(hooks)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var name = _step2.value;

          this.hooks[name] = this.runHook.bind(this, name);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'runCommand',
    value: function runCommand(name) {
      var commands = this.getConfig().commands;
      var command = commands[name];
      this.execute(command);
    }
  }, {
    key: 'runHook',
    value: function runHook(name) {
      var hooks = this.getConfig().hooks;
      var hook = hooks[name];
      this.execute(hook);
    }
  }, {
    key: 'execute',
    value: function execute(command) {
      var separatorIdx = process.argv.indexOf('--');
      if (separatorIdx > -1) {
        command += ' ' + process.argv.slice(separatorIdx + 1).join(' ');
      }
      (0, _child_process.execSync)(command, { stdio: 'inherit' });
    }
  }]);

  return Scripts;
}();

module.exports = Scripts;