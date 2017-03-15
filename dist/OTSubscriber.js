'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OTSubscriber = function (_Component) {
  _inherits(OTSubscriber, _Component);

  function OTSubscriber(props) {
    _classCallCheck(this, OTSubscriber);

    var _this = _possibleConstructorReturn(this, (OTSubscriber.__proto__ || Object.getPrototypeOf(OTSubscriber)).call(this, props));

    _this.state = {
      subscriber: null
    };
    return _this;
  }

  _createClass(OTSubscriber, [{
    key: 'createSubscriber',
    value: function createSubscriber() {
      this.destroySubscriber();

      if (!this.props.session || !this.props.stream) {
        return;
      }

      var container = document.createElement('div');
      (0, _reactDom.findDOMNode)(this).appendChild(container);

      var subscriber = this.props.session.subscribe(this.props.stream, container, this.props.properties, function (err) {
        if (err) {
          console.error('Failed to publish to OpenTok session:', err);
        }
      });

      if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
        subscriber.on(this.props.eventHandlers);
      }

      this.setState({ subscriber: subscriber });
    }
  }, {
    key: 'destroySubscriber',
    value: function destroySubscriber(session) {
      var _this2 = this;

      if (!session) {
        session = this.props.session;
      }

      if (this.state.subscriber) {
        if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
          this.state.subscriber.once('destroyed', function () {
            _this2.state.subscriber.off(_this2.props.eventHandlers);
          });
        }

        if (session) {
          session.unsubscribe(this.state.subscriber);
        }
      }
    }
  }, {
    key: 'getSubscriber',
    value: function getSubscriber() {
      return this.state.subscriber;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createSubscriber();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this3 = this;

      var cast = function cast(value, Type, defaultValue) {
        return value === undefined ? defaultValue : Type(value);
      };

      var updateSubscriberProperty = function updateSubscriberProperty(key) {
        var previous = cast(prevProps.properties[key], Boolean, true);
        var current = cast(_this3.props.properties[key], Boolean, true);
        if (previous !== current) {
          _this3.state.subscriber[key](current);
        }
      };

      updateSubscriberProperty('subscribeToAudio');
      updateSubscriberProperty('subscribeToVideo');

      if ((!prevProps.session || !prevProps.stream) && this.props.session && this.props.stream) {
        this.createSubscriber();
      } else if (prevProps.session && prevProps.stream && (!this.props.session || !this.props.stream)) {
        this.destroySubscriber(prevProps.session);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.destroySubscriber();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', null);
    }
  }]);

  return OTSubscriber;
}(_react.Component);

exports.default = OTSubscriber;


OTSubscriber.propTypes = {
  stream: _react.PropTypes.object,
  session: _react.PropTypes.object,
  properties: _react.PropTypes.object,
  eventHandlers: _react.PropTypes.objectOf(_react.PropTypes.func)
};

OTSubscriber.defaultProps = {
  properties: {}
};