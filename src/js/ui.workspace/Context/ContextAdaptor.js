export default {
  save: function() {
    this.props.contextController.save();
  },

  feedSaveStateChange: function() {
    this.emit("ChangedSaveState");
    this.forceUpdate();
  },

  goingToContextStop: function() {

    this.props.contextController.pause();
    this.emit("ContextFocused", {
      contextType: this.props.contextType,
      contextController: this.getContextController()
    });
  },

  goingToContextRunning: function() {
    this.props.contextController.resume();

    this.emit("ContextFocused", {
      contextType: this.props.contextType,
      contextController: this.getContextController()
    });
  },

  getContextController: function() {
    return this.props.contextController;
  },

  getRootBaseStyle() {
    var style = {
      width: this.props.width,
      height: this.props.height,
      position: 'absolute',
      transition: "all .3s"
    };

    if (this.props.runningState) {
      style.opacity = 1;
    } else {
      style.opacity = 0;
      style.pointerEvents = 'none';
    }

    return style;
  },

  notifyMethod(_title, _message, _level) {
    this.emit("NoticeMessage", {
      title: _title,
      message: _message,
      level: _level || 'info'
    });
  },

  componentDidUpdate: function() {
    if (this.props.runningState === this.props.contextController.running) return;

    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  componentDidMount: function() {
    var self = this;
    this.props.contextController.context = this;
    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  }
};