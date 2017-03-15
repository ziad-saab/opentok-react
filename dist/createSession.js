"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSession;
function createSession(_ref) {
  var apiKey = _ref.apiKey,
      sessionId = _ref.sessionId,
      token = _ref.token,
      onStreamsUpdated = _ref.onStreamsUpdated;

  var streams = [];

  var onStreamCreated = function onStreamCreated(event) {
    var index = streams.findIndex(function (stream) {
      return stream.id === event.stream.id;
    });
    if (index < 0) {
      streams.push(event.stream);
      onStreamsUpdated(streams);
    }
  };

  var onStreamDestroyed = function onStreamDestroyed(event) {
    var index = streams.findIndex(function (stream) {
      return stream.id === event.stream.id;
    });
    if (index >= 0) {
      streams.splice(index, 1);
      onStreamsUpdated(streams);
    }
  };

  var eventHandlers = {
    streamCreated: onStreamCreated,
    streamDestroyed: onStreamDestroyed
  };

  var session = OT.initSession(apiKey, sessionId);
  session.on(eventHandlers);
  session.connect(token);

  return {
    session: session,
    streams: streams,
    disconnect: function disconnect() {
      if (session) {
        session.off(eventHandlers);
        session.disconnect();
      }

      streams = null;
      onStreamCreated = null;
      onStreamDestroyed = null;
      eventHandlers = null;
      session = null;

      this.session = null;
      this.streams = null;
    }
  };
}