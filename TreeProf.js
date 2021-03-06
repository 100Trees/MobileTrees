import React, { Component } from 'react';
import { 
  AppRegistry, 
  View, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Navigator,
  Text,
  TouchableHighlight 
} from 'react-native';
import _ from 'lodash';
import MapView from 'react-native-maps';

const { height, width } = Dimensions.get('window');
const spacer = width * 0.05;
const ASPECT_RATIO = width / height;
const LATITUDE = 37.7749;
const LONGITUDE = -122.4914;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const URL = 'http://localhost:3000';

export default class TreeProf extends Component {

   constructor(props) {
        super(props); 
        this.onPressPhoto = this.onPressPhoto.bind(this);
        this.state = {
          disp: {},
          username: '',
          tree: {},
          region: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
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
    .then(response => {
      return response.json()
    })
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
        tree: info.tree,
        region: {            
          latitude: parseFloat(info.latitude),
          longitude: parseFloat(info.longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        marker: {
          coordinate: {
            latitude: parseFloat(info.tree.latitude),
            longitude: parseFloat(info.tree.longitude)
          },
          key: info.tree.id,
          color: '#00FF00'
        }
      }, () => {
        t.map.animateToRegion(t.state.region);
      });
    });
  }

  onPressPhoto() {
    this.props.navigator.push({
      id: this.props.id,
      index: 2,
      username: this.state.username,
      disp: this.state.disp,
      tree: this.state.tree
    })
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    const status = this.state.tree && this.state.tree.is_healthy ? <Text style={ styles.savedText }>SAVED</Text> :  <Text style={ styles.infectedText }>INFECTED</Text> ;

      
    return (
      <View
        style={styles.container}
      >
        <TouchableHighlight onPress={this.onPressPhoto} style={styles.imageContainer}>
          <Image
            style={styles.img}
            source={ this.state.disp.media ? {uri: this.state.disp.media[0].photo } : { uri: 'https://facebook.github.io/react/img/logo_og.png'}}
          />
        </TouchableHighlight>
        <View style={styles.row1}>
          <View style={styles.statusContainer}>
          {status}
          </View>
          <View style={styles.cityTextContainer}>
            <Text style={styles.cityText}>{ this.state.tree ? this.state.tree.city : 'CITY, STATE' }</Text>
          </View>
        </View>
        <View style={styles.row2}>
          <Text style={styles.descriptionText}>{ this.state.tree ? this.state.tree.description : 'DESCRIPTION' }</Text>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            provider={this.props.provider}
            ref={ref => { this.map = ref; }}
            mapType={"standard"}
            style={styles.map}
            initialRegion={this.state.region}
            onRegionChange={region => this.onRegionChange(region)}
          >
            {this.state.marker && <MapView.Marker key={this.state.marker.key} coordinate={this.state.marker.coordinate} pinColor={this.state.marker.color} /> }
          </MapView>
        </View>
      </View>
    );
    
  }
}

TreeProf.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: width , 
    height: width ,
    borderWidth: 3, 
    borderColor: '#979797'
  },
  row1: {
    margin: spacer,
    flexDirection: 'row',
  },
  statusContainer: {
  },
  infectedText: {
    color: '#D0011B',
    fontSize: 20,
  },
  savedText: {
    color: '#417505',
    fontSize: 20,
  },
  cityTextContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  cityText: {
    color: '#9B9B9B',
    fontSize: 16
  },
  row2: {
    marginBottom: spacer,
    marginLeft: spacer
  },
  descriptionText: {
    color: '#4A4A4A',
    fontSize: 16
  },
  mapContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  map: {
    width: width,
    height: 41,
    alignItems: 'stretch'
  },
});