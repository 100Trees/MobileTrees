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

    this.state = {
      disp: {},
      username: '',
      tree: {}
    };
  }

  componentWillMount() {
    var t = this;
    fetch(URL + '/api/tree/info',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.props.id
        })
      }
    )
    .then(response => response.json())
    .then((info) =>  {
      let disp = 
        {
          title: 'Multiple photos',
          description: 'with captions and no nav arrows',
          displayNavArrows: false,
          displayActionButton: true,
          media: []
        };
      _.each(info.pictures, (pic) => {
        disp.media.push({ photo: URL + '/uploads/' + pic.filename })
      })
      t.setState(
      {
        username: info.username,
        disp,
        tree: info.tree
      });
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
    if (this.state.disp) {
      return (
        <PhotoBrowser
          onBack={() => this.props.navigator.pop()}
          mediaList={this.state.disp.media}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingTop: 54,
    paddingLeft: 16,
  },
  row: {
    flex: 1,
    padding: 8,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  rowTitle: {
    fontSize: 14,
  },
  rowDescription: {
    fontSize: 12,
  },
});