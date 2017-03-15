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

var OTPublisher = function (_Component) {
  _inherits(OTPublisher, _Component);

  function OTPublisher(props) {
    _classCallCheck(this, OTPublisher);

    var _this = _possibleConstructorReturn(this, (OTPublisher.__proto__ || Object.getPrototypeOf(OTPublisher)).call(this, props));

    _this.streamCreatedHandler = function (event) {
      _this.setState({ lastStreamId: event.stream.id });
    };

    _this.sessionConnectedHandler = function (event) {
      _this.publishToSession(_this.state.publisher);
    };

    _this.state = {
      publisher: null,
      lastStreamId: ''
    };
    return _this;
  }

  _createClass(OTPublisher, [{
    key: 'createPublisher',
    value: function createPublisher() {
      this.destroyPublisher();

      if (!this.props.session) {
        return;
      }

      var container = void 0;
      var properties = this.props.properties || {};
      if (properties.insertDefaultUI !== false) {
        container = document.createElement('div');
        (0, _reactDom.findDOMNode)(this).appendChild(container);
      }

      var publisher = OT.initPublisher(container, this.props.properties);
      publisher.on('streamCreated', this.streamCreatedHandler);

      if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
        publisher.on(this.props.eventHandlers);
      }

      if (this.props.session.connection) {
        this.publishToSession(publisher);
      } else {
        this.props.session.once('sessionConnected', this.sessionConnectedHandler);
      }

      this.setState({ publisher: publisher, lastStreamId: '' });
    }
  }, {
    key: 'destroyPublisher',
    value: function destroyPublisher(session) {
      var _this2 = this;

      if (!session) {
        session = this.props.session;
      }

      if (this.state.publisher) {
        this.state.publisher.off('streamCreated', this.streamCreatedHandler);

        if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
          this.state.publisher.once('destroyed', function () {
            _this2.state.publisher.off(_this2.props.eventHandlers);
          });
        }

        if (session) {
          session.unpublish(this.state.publisher);
        }
        this.state.publisher.destroy();
      }
    }
  }, {
    key: 'publishToSession',
    value: function publishToSession(publisher) {
      this.props.session.publish(publisher, function (err) {
        if (err) {
          console.error('Failed to publish to OpenTok session:', err);
        }
      });
    }
  }, {
    key: 'getPublisher',
    value: function getPublisher() {
      return this.state.publisher;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createPublisher();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this3 = this;

      var useDefault = function useDefault(value, defaultValue) {
        return value === undefined ? defaultValue : value;
      };

      var shouldUpdate = function shouldUpdate(key, defaultValue) {
        var previous = useDefault(prevProps.properties[key], defaultValue);
        var current = useDefault(_this3.props.properties[key], defaultValue);
        return previous !== current;
      };

      var updatePublisherProperty = function updatePublisherProperty(key, defaultValue) {
        if (shouldUpdate(key, defaultValue)) {
          var value = useDefault(_this3.props.properties[key], defaultValue);
          _this3.state.publisher[key](value);
        }
      };

      if (shouldUpdate('videoSource', undefined)) {
        this.createPublisher();
        return;
      }

      updatePublisherProperty('publishAudio', true);
      updatePublisherProperty('publishVideo', true);

      if (!prevProps.session && this.props.session) {
        this.createPublisher();
      } else if (prevProps.session && !this.props.session) {
        this.destroyPublisher(prevProps.session);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.session) {
        this.props.session.off('sessionConnected', this.sessionConnectedHandler);
      }

      this.destroyPublisher();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', null);
    }
  }]);

  return OTPublisher;
}(_react.Component);

exports.default = OTPublisher;


OTPublisher.propTypes = {
  session: _react.PropTypes.object,
  properties: _react.PropTypes.object,
  eventHandlers: _react.PropTypes.objectOf(_react.PropTypes.func)
};

OTPublisher.defaultProps = {
  properties: {}
};