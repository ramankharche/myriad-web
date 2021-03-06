var React = require('react');
var createReactClass = require('create-react-class');
var buildClassName = require('../mixins/buildClassName');
import PropTypes from 'prop-types';

module.exports = createReactClass({

  propTypes: {
    active: PropTypes.bool,
    onSelect: PropTypes.func,
    onDisabledSelect: PropTypes.func,
    disabled: PropTypes.bool
  },

  mixins: [buildClassName],

  notifyDisabledSelect: function() {
    if (this.props.onDisabledSelect) {
      this.props.onDisabledSelect();
    }
  },

  onSelect: function() {
    if (this.props.disabled) {
      this.notifyDisabledSelect();
      //early return if disabled
      return;
    }
    if (this.props.onSelect) {
      this.props.onSelect();
    }
    this.props._internalSelect();
  },

  handleKeyUp: function(e) {
    if (e.key === ' ') {
      this.onSelect();
    }
  },

  handleKeyDown: function(e) {
    if (e.key === 'Enter') {
      this.onSelect();
    }
  },

  handleClick: function() {
    this.onSelect();
  },

  handleHover: function() {
    this.props._internalFocus(this.props.index);
  },

  buildName: function() {
    var name = this.buildClassName('Menu__MenuOption');
    if (this.props.active){
      name += ' Menu__MenuOption--active';
    }
    if (this.props.disabled) {
      name += ' Menu__MenuOption--disabled';
    }
    return name;
  },

  render: function() {
    return (
      <div
        onClick={this.handleClick}
        onKeyUp={this.handleKeyUp}
        onKeyDown={this.handleKeyDown}
        onMouseOver={this.handleHover}
        onTouchStart={this.handleClick}
        className={this.buildName()}
        role="menuitem"
        tabIndex="-1"
        aria-disabled={this.props.disabled}
      >
        {this.props.children}
      </div>
    )
  }

});
