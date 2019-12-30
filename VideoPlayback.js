
import React, {Component,PropTypes} from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Dimensions
} from 'react-native';


var Platform = require('react-native').Platform;
var Video = require('react-native-video').default;
var _video = Video;

var StartTimeNeed = 0.0;
var EndTimeNeed = 0.0;

var durationOfVideo = 0.0
var prevStartValue = 0.0

var SCREEN_HEIGH = Dimensions.get('window').height;
var SCREEN_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  videoPlaybackContainer:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
    },
    nativeVideoControls: {
      left:0,
      right:0,
      width:SCREEN_WIDTH,
      height: SCREEN_HEIGH*0.5
    },
    playPauseButton:{
      position:'absolute',
      alignSelf:'center',
      width:50,
      top:-SCREEN_HEIGH*0.25,
      height:50
    }
});

export default class VideoPlayback extends Component {

  static propTypes = {
    startTime:PropTypes.number.isRequired,
    endTime:PropTypes.number.isRequired
  }

  componentWillReceiveProps(){
    StartTimeNeed = this.props.startTime;
    EndTimeNeed = this.props.endTime;
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.setDuration = this.setDuration.bind(this.props.delegateForVideoPlayback);
    this.setTime = this.setTime.bind(this.props.delegateForVideoPlayback);
   }

   state = {
       duration: 0.0,
       currentTime: 0.0,
       isPaused:false
   };

  setDuration(data) {
    durationOfVideo = data.duration;
      this.setState({duration: data.duration});
  }
  setTime(data) {
    if (data.currentTime>EndTimeNeed || prevStartValue != StartTimeNeed) {
        _video.seek(StartTimeNeed);
    }
    prevStartValue = StartTimeNeed;
    this.setState({currentTime: data.currentTime});
    console.log('on set time',data.currentTime,StartTimeNeed,EndTimeNeed);
  }

  renderButton() {
  return (
    <TouchableHighlight onPress={this.onPressButton.bind(this)}>
      <Image
        style={styles.playPauseButton}
        source={this.state.isPaused ? require('./videoPlayButton.png') : require('./videoPauseButton.png') }
      />
    </TouchableHighlight>
  );
  }

  onPressButton(){
    this.setState({
      isPaused:!this.state.isPaused
    });
  }

  render() {
  return(  <View style={styles.videoPlaybackContainer}>
      {this.renderVideoPlayer()}
      {durationOfVideo != 0.0 ? this.renderButton() : this.nothing()}
      </View>);
  }

  nothing(){
    return (<View />);
  }
  renderVideoPlayer(){
    return (
      <Video
         ref = {(vid)=>{
           _video = vid;
         }}
         source={{uri: this.props.videoURLForPlayback}} // Can be a URL or a local file.
         rate={1.0}                   // 0 is paused, 1 is normal.
         volume={1.0}                 // 0 is muted, 1 is normal.
         muted={false}                // Mutes the audio entirely.
         paused={this.state.isPaused}               // Pauses playback entirely.
         repeat={true}
         controls={true}
         playInBackground={false}     // Audio continues to play when aentering background.
         playWhenInactive={false}     // [iOS] Video continues to play whcontrol or notification center are shown.
         resizeMode="cover"           // Fill the whole screen at aspect ratio.
         onLoadStart={this.loadStart} // Callback when video starts to load
         onLoad={this.setDuration}    // Callback when video loads
         onProgress={this.setTime}    // Callback every ~250ms with currentTime
         onEnd={this.onEnd}           // Callback when playback finishes
         onError={this.videoError}    // Callback when video cannot be loaded
         key={this.props.randkey}
         style={styles.nativeVideoControls}/>
    );
  }
}
