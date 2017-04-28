/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';
import HomeMap from './HomeMap';
import PhotoBrowserModule from './PhotoBrowserModule';
import TreeProf from './TreeProf';

class Original extends React.Component {
	_renderScene(route, navigator) {
		if (route.index === 0) {
      return (
        <HomeMap
        	navigator={navigator}
        />
      );
    } else if (route.index === 1) {
    	return (
    		<TreeProf 
    			navigator={navigator}
    			id={route.id}
    		/>
    		);
    } else if (route.index === 2) {
    	return (
    		<PhotoBrowserModule
    			navigator={navigator}
    			id={route.id}
    			username={route.username}
    			disp={route.disp}
    			tree={route.tree}
    		/>
    	);
    }
	}

  render() {
    return (
      <Navigator
        ref="nav"
        initialRoute={{ index: 0 }}
        renderScene={this._renderScene}
      />
    );
  }
}

AppRegistry.registerComponent('OneHundredTrees', () => Original);
