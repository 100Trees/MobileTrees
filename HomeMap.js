import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  AppRegistry,
  Platform
} from 'react-native';

import MapView from 'react-native-maps';
var _ = require('lodash');

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 39.01258;
const LONGITUDE = -77.21552;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const URL = Platform.OS === 'ios' ? 'http://localhost:3000/api' : 'http://10.0.3.2:3000/api';

let id = 0;

class HomeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
    };
  }

  componentWillMount () {
    var t = this;
    fetch(URL + '/me')
    .then((response) => response.json())
    .then((user) => {
      t.setState({ region: 
        {
          latitude: user.latitude ? parseFloat(user.latitude) : LATITUDE,
          longitude: user.longitude ? parseFloat(user.longitude) : LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }  
      }, () => {
        t.map.animateToRegion(t.state.region);
        fetch(URL + '/trees',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isHealthy: false,
            latitude: t.state.region.latitude,
            longitude: t.state.region.longitude
          })
        })
        .then((response) => {
          return response.json();
        })
        .then((trees) => {
          trees = _.map(trees, (tree) => {
            //console.log(tree)
            return {
              coordinate: {
                latitude: parseFloat(tree.latitude),
                longitude: parseFloat(tree.longitude)
              },
              key: tree.id,
              color: '#00FF00'
            };
          });
          t.setState({ markers: trees });
        })
        .catch((error) => {
          console.error(error);
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  jumpRandom() {
    this.setState({ region: this.randomRegion() });
  }

  animateRandom() {
    this.map.animateToRegion(this.randomRegion());
  }

  randomRegion() {
    const region = this.state.region;
    return {
      latitude: region.latitude + ((Math.random() - 0.5) * (region.latitudeDelta / 2)),
      longitude: region.longitude + ((Math.random() - 0.5) * (region.longitudeDelta / 2)),
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          ref={ref => { this.map = ref; }}
          mapType={"standard"}
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChange={region => this.onRegionChange(region)}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.color}
              
            />
          ))}
        </MapView>
        <View style={[styles.bubble, styles.latlng]}>
          <Text style={{ textAlign: 'center' }}>
            {this.state.region.latitude.toPrecision(7)},
            {this.state.region.longitude.toPrecision(7)}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.jumpRandom()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Jump</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.animateRandom()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Animate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

HomeMap.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

module.exports = HomeMap;