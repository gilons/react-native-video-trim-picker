/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'use strict';

 import React, {Component} from 'react';
 import {
   AppRegistry,
   StyleSheet,
   Navigator,
   Text,
   TouchableHighlight,
   View
 } from 'react-native';

 import VideoScreen from './VideoTrimView.js'

 const styles = StyleSheet.create({
   container: {
     flex: 1
   }
 });

 const routes = [
   {title: 'Pick and Trim Video', index: 0},
   {title: 'Timmed Video', index: 1},
 ];

 class VideoTrimApp extends Component {
   render() {
     return (
       <Navigator
         initialRoute={routes[0]}
         initialRouteStack={routes}
         renderScene={(route, navigator) =>
           <VideoScreen
               />
         }


         navigationBar={
            <Navigator.NavigationBar
              routeMapper={{
                LeftButton: (route, navigator, index, navState) =>
                {
                  if (route.index === 0) {
                    return null;
                  } else {
                    return (
                      <TouchableHighlight onPress={() => navigator.pop()}>
                        <Text>Back</Text>
                      </TouchableHighlight>
                    );
                  }
                },
                RightButton: (route, navigator, index, navState) =>
               {
                 if (route.index === 0) {
                   return null;
                 } else {
                   return (
                     <TouchableHighlight onPress={() => navigator.pop()}>
                       <Text>Back</Text>
                     </TouchableHighlight>
                   );
                 }
               },
              Title: (route, navigator, index, navState) =>
                  { return (<Text>{routes[index].title}</Text>); },
              }}

              style={{backgroundColor: '#48BBEC'}}
            />
         }

         style={styles.container}
       />
     );
   }
 }
 AppRegistry.registerComponent('VideoTrimApp', () => VideoTrimApp);
