'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = OTStreams;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function OTStreams(props) {
  if (!props.session) {
    return null;
  }

  var child = _react.Children.only(props.children);

  var childrenWithProps = props.streams.map(function (stream) {
    return (0, _react.cloneElement)(child, {
      session: props.session,
      stream: stream,
      key: stream.id
    });
  });

  return _react2.default.createElement(
    'div',
    null,
    childrenWithProps
  );
}

OTStreams.propTypes = {
  children: _react.PropTypes.element.isRequired,
  session: _react.PropTypes.object,
  streams: _react.PropTypes.arrayOf(_react2.default.PropTypes.object)
};