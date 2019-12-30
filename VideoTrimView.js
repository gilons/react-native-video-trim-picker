
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  CameraRoll,
  Text,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import RNAssetThumbnail from  'react-native-asset-thumbnail';
import VideoTrimmingSlider from './VideoTrimmingSlider.js'
import VideoPlayback from './VideoPlayback.js'

var Platform = require('react-native').Platform;
var Video = require('react-native-video').default;
var ImagePicker = require('react-native-image-picker');

var SCREEN_HEIGH = Dimensions.get('window').height;
var SCREEN_WIDTH = Dimensions.get('window').width;
var THUMBNAIL_SIZE = 70.0
var MAXTRIM_DURATION = 20.0

var options = {
  mediaType: "video",
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


const styles = StyleSheet.create({
  pickvideo: {
    height: 35,
    top:100,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  trimvideo: {
    height: 35,
    top:20,
    alignSelf: 'center',
  },
  containerTrimmerBottomView:{
    width:SCREEN_WIDTH,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  sliderValuesView:{
    top:10,
    width:SCREEN_WIDTH,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  sliderValuesText1: {
    fontSize: 18,
    color: 'black',
  },
  sliderValuesText2: {
    fontSize: 18,
    color: 'black',
  },
  backgroundView: {
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center',
    top:50
  },
  backgroundViewTrimmer: {
    padding:10,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'
  }
});

export default class VideoTrimView extends Component {

  constructor(props, context, ...args) {
    super(props, context, ...args);
   }

  state = {
      videoStartTime: 0.0,
      videoEndTime: 20.0,
      videourl : '',
      originalVideoURLReference: '',
      thumbnails:[],
      duration: 0.0,
      currentTime:0.0,
      keyRandom: 0.0,
      computedSliderWidth: 0.0,
      scaleFactorForTime: 0.0
  };

  render() {
    // return this.renderTest();
       return this.state.videourl != '' ? this.renderVideoPlayerAndTrimmer() : this.renderVideoOptions();
  }

  renderVideoOptions(){
    return (
      <Text style={styles.pickvideo} onPress={this.showMediaPicker.bind(this)}>Pick Video</Text>
    );
  }

  renderVideoPlayerAndTrimmer(){
    return (
      <View style={styles.backgroundView}>
        <VideoPlayback videoURLForPlayback = {this.state.videourl} randkey = {this.state.keyRandom} delegateForVideoPlayback = {this} startTime = {this.state.videoStartTime*this.state.scaleFactorForTime} endTime = { this.state.videoEndTime*this.state.scaleFactorForTime}/>
        {this.state.computedSliderWidth != 0.0 ? this.showVideoTrimmerAndSlider() : this.nothing()}
      </View>
    );
  }

  nothing(){
    return (<View />);
  }

  showVideoTrimmerAndSlider(){
    return (
    <View style = {styles.containerTrimmerBottomView}>
      <View style={styles.backgroundViewTrimmer}>
        <VideoTrimmingSlider
        thumbnailsFetched = {this.state.thumbnails}
        sliderWidth = {this.state.computedSliderWidth}
        delegateForVideotrimmer = {this}
        currentTime = {this.state.currentTime}
        duration = {this.state.duration}/>
      </View>
     {this.addBottomTimeBar()}
     <Text style={styles.trimvideo} onPress={this.startTrimming.bind(this)}>Trim Video Now</Text>
    </View>

  );
  }

  addBottomTimeBar(){
    return (<View style={styles.sliderValuesView}>
    <Text style={styles.sliderValuesText1}>
      00:{Math.floor(this.state.videoStartTime*this.state.scaleFactorForTime)} </Text>
    <Text style={styles.sliderValuesText2}>
      00:{Math.floor(this.state.videoEndTime*this.state.scaleFactorForTime)} </Text>
    </View>);
  }

  showMediaPicker(){
    // Open Image Library:
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else if (response.customButton) {
      }
      else {
        const source = response.uri;
        this.setState({
           videourl : source,
           originalVideoURLReference: source
        },function(){
          console.log('url here',this.state.videourl);
        });
        setTimeout(() => {
          this.createThumbnailFromURLAsset();
          }, 2000);
        }
    });
  }

  startTrimming(){
      RNAssetThumbnail.trimVideoFromStartTime(this.state.videoStartTime*this.state.scaleFactorForTime, this.state.videoEndTime*this.state.scaleFactorForTime, this.state.originalVideoURLReference,(error, trimvideoURL) => {
      if (error) {
        console.error(error);
      }
      else {

        this.setState({
          videourl:trimvideoURL,
          keyRandom: Math.random()
        }, function () {
            console.log(this.state.videourl);
        });
      }
    })
  }


  createThumbnailFromURLAsset(){
    var onScreenThumbnailsCount = (SCREEN_WIDTH/THUMBNAIL_SIZE)
    var totalNumberOfThumbnails = onScreenThumbnailsCount * (this.state.duration/MAXTRIM_DURATION)
    var tempWidth = SCREEN_WIDTH-20
    var tempScaleFortime = 1.0
    if (this.state.duration < MAXTRIM_DURATION) {
        tempWidth = Math.ceil(totalNumberOfThumbnails) * THUMBNAIL_SIZE
        tempScaleFortime = (this.state.duration/MAXTRIM_DURATION)
    }
    this.setState({
      computedSliderWidth:tempWidth,
      scaleFactorForTime:tempScaleFortime
    },function(){
      console.log("width here",tempWidth,totalNumberOfThumbnails);
    });

      RNAssetThumbnail.generateThumbnail(this.state.videourl, THUMBNAIL_SIZE, THUMBNAIL_SIZE, Math.ceil(totalNumberOfThumbnails),(error, thumbnailData) => {
      if (error) {
        console.error(error);
      } else {
        this.setState({thumbnails:thumbnailData},function(){
          console.log('data here');
        });
      }
    })
  }
}
