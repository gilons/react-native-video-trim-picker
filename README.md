# react-native-video-trim-picker
A React Native module that allows you to use native UI to select video from the device library and trim it.

## Install

`npm install https://github.com/MYFC2015/react-native-video-trim-picker/tarball/master --save`

Automatically link the libarary:

`rnpm link react-native-video-trim-picker`



### iOS - Manual linking (do not need this if `rnpm link ...` is used)

1. In the XCode's "Project navigator", right click on your project's Libraries folder ➜ `Add Files to <...>`
2. Go to `node_modules` ➜ `react-native-video-trim-picker` ➜ `ios` ➜ select `RNVideoTrimPicker.xcodeproj`
3. Add `RNVideoTrimPicker.a` to `Build Phases -> Link Binary With Libraries`
4. Compile and have fun

### Android  - Manual linking (do not need this if `rnpm link ...` is used)
```gradle
// file: android/settings.gradle
...

include ':react-native-video-trim-picker'
project(':react-native-video-trim-picker').projectDir = new File(settingsDir, '../node_modules/react-native-video-trim-picker/android')
```
```gradle
// file: android/app/build.gradle
...

dependencies {
    ...
    compile project(':react-native-video-trim-picker')
}
```
```xml
<!-- file: android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.myApp">

    <uses-permission android:name="android.permission.INTERNET" />

    <!-- add following permissions -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-feature android:name="android.hardware.camera" android:required="false"/>
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false"/>
    <!-- -->
    ...
```
```java
// file: android/app/src/main/java/com/<...>/MainApplication.java
...

import com.myfc.videotrimpicker.VideoTrimPickerPackage; // <-- add this import

public class MainApplication extends Application implements ReactApplication {
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new VideoTrimPickerPackage() // <-- add this line
        );
    }
...
}

```
## Usage

```javascript
var Platform = require('react-native').Platform;
var VideoTrimPicker = require('react-native-video-trim-picker');

// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: 'Pick and Trim Video',
  customButtons: [
    {name: 'trim', title: 'Trim Video Now'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  customStyles: {
  	pickvideo: { height: 35 },
  	trimvideo: { alignSelf: 'center' },
  	containerTrimmerBottomView:{ flexDirection:'column'},
  	sliderValuesView:{ justifyContent:'space-between'},
  	sliderValuesText1: { fontSize: 18,  color: 'black'},
  	sliderValuesText2: { fontSize: 18,  color: 'black'},
  	backgroundView: { flexDirection:'column'	},
  	backgroundViewTrimmer: {	  alignItems:'center' 	}
  }
};

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */
VideoTrimPicker.showVideoTrimPicker(options, (response) => {
  console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled video picker');
  }
  else if (response.error) {
    console.log('VideoTrimPicker Error: ', response.error);
  }
  else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  }
  else {
    // You can display the video using either data...
    const source = {uri: 'data:video/mp4;base64,' + response.data, isStatic: true};
    // or a reference to the platform specific asset location
    if (Platform.OS === 'ios') {
      const source = {uri: response.uri.replace('file://', ''), isStatic: true};
    } else {
      const source = {uri: response.uri, isStatic: true};
    }

    this.setState({
      myTrimmedVideoSource: source
    });
  }
});
```

Then later, if you want to display this video in your render() method:
```javascript
<Video source={this.state.myTrimmedVideoSource} />
```



### Options

option | iOS  | Android | Info
------ | ---- | ------- | ----
title | OK | OK | Specify `null` or empty string to remove the title
cancelButtonTitle | OK | OK |
customButtons | OK | OK | An array containing objects with the name and title of buttons
videoQuality | OK |  OK | 'low', 'medium', or 'high' on iOS, 'low' or 'high' on Android
durationLimit | OK | OK | Max video trimming time, in seconds
noData | OK | OK | If true, disables the base64 `data` field from being generated (greatly improves performance on large videos)
storageOptions | OK | OK | If this key is provided, the video will get saved in the Documents directory on iOS, and the Videos directory on Android (rather than a temporary directory)
storageOptions.path | OK | - | If set, will save video at /Documents/[path] rather than the root
storageOptions.cameraRoll | OK | - | If true, the trimmed video will be saved to the iOS Camera roll.

### The Response Object

key | iOS | Android | Description
------ | ---- | ------- | ----------------------
didCancel | OK | OK | Informs you if the user cancelled the process
error | OK | OK | Contains an error message, if there is one
data | OK | OK | The base64 encoded video data 
uri | OK | OK | The uri to the local file asset on the device
origURL | OK | - | The URL of the original asset in library, if it exists
width | OK | OK | Video dimensions
height | OK | OK | Video dimensions
fileSize | OK | OK | The file size
type | - | OK | The file type 
fileName | - | OK | The file name 
path | - | OK | The file path
