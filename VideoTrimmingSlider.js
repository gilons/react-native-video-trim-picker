
import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SliderIOS,
  Image
} from 'react-native';

var MultiSlider  = require('./Slider.js');
var customMarker = require('./customMarker.js');
var TimerMixin = require('react-timer-mixin');


var SCREEN_HEIGH = Dimensions.get('window').height;
var SCREEN_WIDTH = Dimensions.get('window').width;
var MAXTRIM_DURATION = 20.0
var THUMBNAIL_SIZE = 70.0
var WIDTH_PER_SECOND = SCREEN_WIDTH/MAXTRIM_DURATION
var HANDLER_WIDTH = 7.5

var tempRefStartForScroll = 0.0
var tempRefEndForScroll = 0.0
var tempRefStartForSlider = 0.0
var tempRefEndForSlider = 0.0

var tempRefStartTime = 0.0
var tempRefEndTime = 0.0

var offsetX = 0.0

var start = 0.0
var end = 20.0

var currentWidthOfLeftOverlay = 0.0;
var currentWidthOfRightOverlay = 0.0;
var widthFactor = 0.0;

var prevValue1 = 0.0;

const styles = StyleSheet.create({
  containerSlider:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'flex-start',
      left:0,
      right:0,
      overflow:'hidden',
      height:THUMBNAIL_SIZE,
    },
    scrollViewContainer:{
      position:'absolute',
      top:0,
      left:0,
      right:0,
      overflow:'hidden'
    },
    sliderViewContainer:{
      alignSelf:'center',
      left:3,
      right:3
    },
    leftOverlayView:{
      position:'absolute',
      left:0,
      height:THUMBNAIL_SIZE,
      backgroundColor:'white',
      opacity:0.5,
      alignSelf:'flex-start'
    },
    rightOverlayView:{
      position:'absolute',
      right:0,
      height:THUMBNAIL_SIZE,
      backgroundColor:'white',
      opacity:0.5,
      alignSelf:'flex-end'
    },
    imageStyle: {
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
    },
    cursorIndicator:{
      position:'absolute',
      width:4,
      height:THUMBNAIL_SIZE,
      backgroundColor: 'white'
    }
});

export default class VideoTrimmingSlider extends Component {
    static propTypes = {
      thumbnailsFetched: PropTypes.array.isRequired,
      delegateForVideotrimmer: PropTypes.object.isRequired,
      currentTime: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired
    }

    constructor(props, context, ...args) {
       super(props, context, ...args);
       this.SliderOneValuesChangeStart = this.SliderOneValuesChangeStart.bind(this);
       this.SliderOneValuesChange = this.SliderOneValuesChange.bind(this.props.delegateForVideotrimmer);
       this.SliderOneValuesChangeFinish = this.SliderOneValuesChangeFinish.bind(this);
       this.scrollMoved = this.scrollMoved.bind(this.props.delegateForVideotrimmer);
       this.scrollEnded = this.scrollEnded.bind(this);
    }

    componentWillReceiveProps(){
      widthFactor = this.props.sliderWidth/10.0;
    }

    state = {
      currentPosOfIndicator:0.0
    };

    componentDidMount(){
      if (this.props.duration<MAXTRIM_DURATION) {
        WIDTH_PER_SECOND = (this.props.sliderWidth-20)/this.props.duration;
        console.log('ekse',this.props.duration);
      }else{
        WIDTH_PER_SECOND = (SCREEN_WIDTH-20)/MAXTRIM_DURATION;
        console.log('ifff',this.props.duration);
      }


      setInterval( () => {
        if (this.props.currentTime>end) {
          this.setState({
            currentPosOfIndicator:start
          });
        }
        else{
          var posToMove = this.props.currentTime * WIDTH_PER_SECOND +HANDLER_WIDTH - offsetX;
          this.setState({
            currentPosOfIndicator:posToMove
          });
        }
     }, 100);
    }

    scrollEnded(){
      tempRefStartForSlider = tempRefStartTime;
      tempRefEndForSlider = tempRefEndTime;
    }

    SliderOneValuesChangeStart() {

    }

    SliderOneValuesChange(values) {
      if (prevValue1 != values[0]) {
          currentWidthOfLeftOverlay = widthFactor*0.5*values[0]*2;
      }else{
          currentWidthOfRightOverlay = widthFactor*0.5*(10-values[1])*2;
      }
      start = (tempRefStartForSlider + (values[0]*2));
      end = (tempRefEndForSlider + (values[1]*2));
      tempRefStartTime = (values[0]*2);
      tempRefEndTime = (values[1]*2);
      prevValue1 = values[0];
        this.setState({
          videoStartTime : start,
          videoEndTime : end,
        });
    }

    SliderOneValuesChangeFinish() {
      tempRefStartForScroll = tempRefStartTime;
      tempRefEndForScroll = tempRefEndTime;
    }

    scrollMoved(event: Object) {
      offsetX = event.nativeEvent.contentOffset.x;
      start =   tempRefStartForScroll + (offsetX- HANDLER_WIDTH )/WIDTH_PER_SECOND;
      end =  (tempRefEndForScroll == 0.0) ? (tempRefEndForScroll+20+ ((offsetX-HANDLER_WIDTH)/WIDTH_PER_SECOND)) : (tempRefEndForScroll  + ((offsetX-HANDLER_WIDTH)/WIDTH_PER_SECOND));
      tempRefStartTime = Math.floor((offsetX-HANDLER_WIDTH)/WIDTH_PER_SECOND);
      tempRefEndTime = Math.floor((offsetX-HANDLER_WIDTH)/WIDTH_PER_SECOND);
      this.setState({
        videoStartTime : start,
        videoEndTime : end
      });
    }

    render() {
        return (
          <View style={[styles.containerSlider]}>

          <View style = {styles.scrollViewContainer}>
            {this.renderScrollView()}
          </View>

          <View style={[styles.leftOverlayView, {width:currentWidthOfLeftOverlay}]}>
          </View>

          <View style={[styles.rightOverlayView, {width:currentWidthOfRightOverlay}]}>
          </View>

          <View style={[
             styles.cursorIndicator,
             {left: this.state.currentPosOfIndicator},
          ]}>
          </View>

          <View style = {[styles.sliderViewContainer,{width:this.props.sliderWidth}] }>
            {this.renderSlider()}
          </View>

          </View>
        )
    }

    renderScrollView() {
      return (
        <ScrollView
          horizontal={true}
          onScroll={this.scrollMoved}
          onMomentumScrollEnd={this.scrollEnded}
          scrollEventThrottle={200}>
          {this.props.thumbnailsFetched.map(this.renderThumbnails.bind(this))}
        </ScrollView>
        );
    }

    renderSlider(){
      return (<MultiSlider
        values={[0,10]}
        step={0.1}
        sliderLength={this.props.sliderWidth-8}
        selectedStyle={{
          backgroundColor: 'transparent'
        }}
        unselectedStyle={{
          backgroundColor: 'transparent'
        }}
        trackStyle={{
          height:1,
          borderRadius: 1
        }}
        customMarker={customMarker}
        onValuesChangeStart={this.SliderOneValuesChangeStart}
        onValuesChange={this.SliderOneValuesChange}
        onValuesChangeFinish={this.SliderOneValuesChangeFinish}
      />)
    }

    renderThumbnails(thumbnail, index) {
        return <Image key={index} style={styles.imageStyle} source={{uri:thumbnail}}/>
    }


}
