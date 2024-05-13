import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
const fetchStoredValues = require('./fetchData.js');

const API_endpoint = 'https://api.openweathermap.org/data/2.5/onecall?';
const API_key = '8cacfe221dc6d1f67d5efbee65ae4035';
const GOOGLE_MAPS_APIKEY = 'AIzaSyDUNC8vh0jx2NZnwYlC79aVhSVtnt83NOQ';

// Custom waypoints
const CurrentLocationImage = require('C:/Users/ryann/Desktop/TRACKERFIXED/AwsomeApp/img/human.png'); 
const TrolleyLocationImage = require('C:/Users/ryann/Desktop/TRACKERFIXED/AwsomeApp/img/trolley.png');



export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [destination, setDestination] = useState(() => ({ latitude: 0, longitude: 0 }));

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          console.log('Location permission granted.');
          const location = await Location.getCurrentPositionAsync({});
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
        } else {
          console.log('Location permission denied.');
          // Handle denied permission case
        }
      } catch (error) {
        console.log('Error requesting location permission:', error);
        // Handle error case
      }
    };

    requestLocationPermission();

  }, []);



  useEffect(() => {
    if (latitude && longitude) {
      const final_API_endpoint = `${API_endpoint}lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${API_key}`;

      axios
        .get(final_API_endpoint)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log('Error fetching weather data:', error);
        }); 
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // Function to fetch stored values and update state
    const fetchAndSetStoredValues = async () => {
      try {
        const [lat, long] = await fetchStoredValues();
        setDestination({ latitude: lat, longitude: long });
      } catch (error) {
        console.error('Error fetching stored values:', error);
      }
    };
  
    // Initial fetch when the component mounts
    fetchAndSetStoredValues();
  
    // Fetch stored values at regular intervals
    const intervalId = setInterval(fetchAndSetStoredValues, 500); // Fetch every 0.5 seconds
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Run only once on component mount
  

  return (
    <View style={styles.container}>
      {latitude && longitude && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >

          {/* Current Location Marker */}
          <Marker coordinate={{ latitude, longitude }}>
            <Image source={CurrentLocationImage} style={{ height: 40, width: 40, resizeMode: 'contain'}} />
          </Marker>

          {/* Destination Marker */}
          <Marker coordinate={destination}>
            <Image source={TrolleyLocationImage} style={{ height: 30, width: 30, resizeMode: 'contain'}} />
          </Marker>

          {/* Render the route line */}
          <MapViewDirections
            origin={{ latitude, longitude }} // Use current location as the origin
            destination={destination} // Set the destination coordinates
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="#1877F2"
          />
        </MapView>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
