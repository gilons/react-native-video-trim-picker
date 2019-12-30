'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  PropTypes
} = React;
var {
  StyleSheet,
  Image
} = ReactNative;

var CustomMarker = React.createClass({

  propTypes: {
    pressed: PropTypes.bool,
  },

  render: function () {
    return (
      <Image
        style={styles.image}
        source={this.props.pressed ? require('./trimHandle_selected.png') : require('./trimHandle_unselected.png')}
        resizeMode='contain'
      />
    );
  }
});

var styles = StyleSheet.create({
  image: {
    height: 70,
    width: 15
  }
});

module.exports = CustomMarker;
