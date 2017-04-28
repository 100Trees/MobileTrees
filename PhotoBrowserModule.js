/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  ActionSheetIOS,
  CameraRoll,
  ListView,
  StyleSheet,
  Navigator,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import _ from 'lodash';

import PhotoBrowser from 'react-native-photo-browser';
const URL = 'http://localhost:3000';

// fill 'Library photos' example with local media


export default class PhotoBrowserModule extends Component {

  constructor(props) {
    super(props);

    this._onSelectionChanged = this._onSelectionChanged.bind(this);
    this._onActionButton = this._onActionButton.bind(this);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }      

  _onSelectionChanged(media, index, selected) {
    alert(`${media.photo} selection status: ${selected}`);
  }

  _onActionButton(media, index) {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions({
        url: media.photo,
        message: media.caption,
      },
      () => {},
      () => {});
    } else {
      alert(`handle sharing on android for ${media.photo}, index: ${index}`);
    }
  }

  
  render() {
    if (this.props.disp) {
      return (
        <PhotoBrowser
          onBack={() => this.props.navigator.pop()}
          mediaList={this.props.disp.media}
          initialIndex={0}
          displayNavArrows={false}
          displaySelectionButtons={false}
          displayActionButton={false}
          startOnGrid={false}
          enableGrid={false}
          useCircleProgress
          onSelectionChanged={this._onSelectionChanged}
          onActionButton={this._onActionButton}
        />
        );
    }
    return (
      <Text>Hey</Text>
      );
  }
}
