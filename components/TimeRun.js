import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import colors from './colors';
import MapView, { AnimatedRegion, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import mapStyles from "./mapStyles.json";
import Geolocation from '@react-native-community/geolocation';
import haversine from 'haversine';
import Torch from 'react-native-torch';

import './globals';

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.005;
const LATITUDE = 0;
const LONGITUDE = 0;

class TimeRun extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          routeCoordinates: [],
          distanceTravelled: 0,
          runningDuration: 0,
          prevLatLng: {},
          runState: {},
          toggleTorch: {},
          coordinate: new AnimatedRegion({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: 0,
            longitudeDelta: 0
          }),
        };
    }
    
    componentDidMount() {
        this.startWatchingPosition();
        this._interval = setInterval(() => {
            this.setState({ runningDuration: this.state.runningDuration + 1 })
        }, 1000);   
    }

    startWatchingPosition = () => {
        const { coordinate } = this.state;
    
        this.watchID = Geolocation.watchPosition(
          position => {
            const { routeCoordinates, distanceTravelled } = this.state;
            const { latitude, longitude } = position.coords;
    
            const newCoordinate = {
                latitude,
                longitude
            };
    
            if (Platform.OS === "android") {
                if (this.marker) {
                    this.marker._component.animateMarkerToCoordinate(
                    newCoordinate,
                    500
                    );
                }
            } else {
                coordinate.timing(newCoordinate).start();
            }
    
            this.setState({
                latitude,
                longitude,
                routeCoordinates: routeCoordinates.concat([newCoordinate]),
                distanceTravelled:
                distanceTravelled + this.calcDistance(newCoordinate),
                prevLatLng: newCoordinate
                });
            },
            error => console.log(error),
            {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 1000,
            distanceFilter: 10
            }
        );
    }
    
    stopWatchingPosition = () => {
        Geolocation.clearWatch(this.watchID);
        Geolocation.stopObserving();
    }

    componentWillUnmount() {
        this.stopWatchingPosition();
        this.toggleRunState('paused');
        this.toggleTorchState('off');
        Torch.switchState(false);
    }
    
    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });
    
    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    toggleRunState = (state) => {
        if (state) {
            let runState = {};
            switch (state) {
                case 'resume':
                    runState = { ...this.state.runState, state: 'running', runAt: new Date() };
                    this.startWatchingPosition();
                    this._interval = setInterval(() => {
                        this.setState({ runningDuration: this.state.runningDuration + 1 })
                    }, 1000);
                    break;
                case 'paused':
                    runState = { ...this.state.runState, state: 'paused', pauseAt: new Date() };
                    clearInterval(this._interval);
                    this.stopWatchingPosition();
                    break;
            }
            this.setState({runState});
        }
    }

    getFormattedTime(time) {
        this.currentTime = time;
    };

    stopRun(distance, duration) {
        global.dis = distance;
        global.dur = duration;
        this.stopWatchingPosition();
        this.toggleRunState('paused');
        this.toggleTorchState('off');
        this.props.navigation.navigate('Run');
    }

    toggleTorchState = (state) => {
        if (state) {
            let toggleTorch = {};
            switch (state) {
                case 'on':
                    toggleTorch = { ...this.state.toggleTorch, state: 'on'};
                    Torch.switchState(true);
                    break;
                case 'off':
                    toggleTorch = { ...this.state.toggleTorch, state: 'off'};
                    Torch.switchState(false);
                    break;
            }
            this.setState({toggleTorch});
        }
    }

    

    render() {
        const {runningDuration, distanceTravelled, runState, toggleTorch} = this.state;
        const duration = new Date(runningDuration * 1000).toISOString().substr(11, 8);
        const distance = parseFloat(distanceTravelled).toFixed(1);
        return (
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <MapView
                    customMapStyle={mapStyles}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    showsUserLocation={true}
                    region={this.getMapRegion()}>
                    <Polyline 
                    coordinates={this.state.routeCoordinates} 
                    strokeWidth={5}
                    strokeColor={colors.purple}
                    fillColor="rgba(181,122,225,0.7)"/>
                    </MapView>
                </View>

                <View style={styles.statsContainer}>
                    <TouchableOpacity 
                    style={styles.startPauseButton}
                    onPress={() => this.toggleRunState(runState.state === 'paused' ? 'resume' : 'paused')}>
                        <Text style={styles.startPauseText}>
                        {runState.state === 'paused' ? 'START' : 'PAUSE'}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.distanceContainer}>
                        <Text style={styles.distanceText}>DISTANCE</Text>
                        <Text style={styles.distance}>{distance} KM</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>TIME</Text>
                        <Text style={styles.distance}>{duration}</Text>
                    </View>
                    <TouchableOpacity
                    style={styles.flashlightButton}
                    onPress={() => this.toggleTorchState(toggleTorch.state === 'off' ? 'on' : 'off')}
                    >
                        <Text style={styles.flashlightText}>
                        {toggleTorch.state === 'off' ? 'FLASHLIGHT ON' : 'FLASHLIGHT OFF'}
                        </Text>                            
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.stopButton}
                    onPress={() => this.stopRun(distance, duration)}>
                        <Text style={styles.stopText}>
                        EXIT
                        </Text>    
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default TimeRun;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: colors.grey,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        fontSize: 20,
        top: 10,
    },
    distanceText: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        fontSize: 20,
    },
    timeText: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        fontSize: 20,
    },
    startPauseText: {
        fontFamily: 'Overpass-Regular',
        color: '#ffb13d',
        textAlign: 'center',
        fontSize: 20,
    },
    distance: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
    },
    distanceContainer: {
        position: 'absolute',
        width: 180,
        height: 190,
        textAlign: 'center',
        marginTop: 90,
        marginLeft: 10,
    },
    timeContainer: {
        position: 'absolute',
        width: 180,
        height: 190,
        textAlign: 'center',
        marginLeft: 170,
        marginTop: 90,
    },
    mapContainer: {
        height: 440,
        width: 360,
        borderRadius: 30,
        top: 10,
    },
    statsContainer: {
        height: 300,
        width: 360,
        backgroundColor: colors.blue,
        top: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    flashlightButton: {
        width: 100,
        height: 60,
        borderColor: colors.white,
        borderWidth: 1,
        marginTop: 180,
        marginLeft: 50,
        marginRight: 10,
    },
    flashlightText: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        fontSize: 15,
        marginTop: 10,
    },
    stopButton: {
        width: 120,
        height: 60,
        backgroundColor:'#c96b6e',
        borderColor: colors.white,
        borderWidth: 1,
        marginTop: 180,
        marginLeft: 40,
    },
    stopText: {
        fontFamily: 'Overpass-Regular',
        color: colors.white,
        textAlign: 'center',
        fontSize: 20,
        marginTop: 15,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 30,
    },
    startPauseButton: {
        position: 'absolute',
        marginLeft: 150,
        marginTop: 30,
    }
});