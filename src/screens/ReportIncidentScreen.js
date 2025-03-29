import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

// Conditionally import MapView to fix web compatibility issues
let MapView;
let Marker;

if (Platform.OS !== 'web') {
  // Only import on native platforms
  const ReactNativeMaps = require('react-native-maps');
  MapView = ReactNativeMaps.default;
  Marker = ReactNativeMaps.Marker;
}

const ReportIncidentScreen = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  // Define validation schema
  const validationSchema = Yup.object().shape({
    type: Yup.string()
      .required('Incident type is required'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
  });

  useEffect(() => {
    (async () => {
      // Request permission for media library
      if (Platform.OS !== 'web') {
        await requestMediaLibraryPermission();
      }
      
      // Get current location
      await getCurrentLocation();
    })();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to upload images.');
    }
  };

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    
    if (Platform.OS === 'web') {
      // For web, set a default location
      setMapRegion({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setLocation({
        coords: {
          latitude: 37.78825,
          longitude: -122.4324,
        }
      });
      setLoadingLocation(false);
      return;
    }
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setLoadingLocation(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (error) {
      setErrorMsg('Could not get current location');
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Taking photos is not available on web.');
      return;
    }
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your camera to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = (values, { resetForm }) => {
    // Would normally send to API
    const reportData = {
      ...values,
      images,
      location: {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      },
      timestamp: new Date().toISOString(),
    };
    
    console.log('Report data:', reportData);

    // Reset form and navigate back
    resetForm();
    setImages([]);
    
    Alert.alert(
      'Report Submitted',
      'Thank you for your report. It will be reviewed by our team.',
      [{ text: 'OK', onPress: () => navigation.navigate('index') }]
    );
  };

  const renderLocationMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webLocationContainer}>
          <Text style={styles.webLocationText}>Location: Default Location</Text>
          <Text style={styles.webLocationSubtext}>Map view not available on web platform</Text>
        </View>
      );
    }

    if (errorMsg) {
      return <Text style={styles.errorMsg}>{errorMsg}</Text>;
    }

    if (!mapRegion || !MapView) {
      return null;
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude
            }}
            draggable
            onDragEnd={(e) => {
              setLocation({
                coords: {
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude
                }
              });
            }}
          />
        </MapView>
        <Text style={styles.mapInfo}>Drag the pin to adjust location if needed</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Report an Incident</Text>
      
      {loadingLocation ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5722" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      ) : errorMsg ? (
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      ) : (
        renderLocationMap()
      )}

      <Formik
        initialValues={{
          type: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Incident Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.type}
                  onValueChange={handleChange('type')}
                  style={styles.picker}
                >
                  <Picker.Item label="Select incident type" value="" />
                  <Picker.Item label="Theft" value="theft" />
                  <Picker.Item label="Vandalism" value="vandalism" />
                  <Picker.Item label="Assault" value="assault" />
                  <Picker.Item label="Suspicious Activity" value="suspicious" />
                  <Picker.Item label="Traffic Incident" value="traffic" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
              {errors.type && touched.type && (
                <Text style={styles.errorText}>{errors.type}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                placeholder="Please describe what happened"
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
              />
              {errors.description && touched.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Photos</Text>
              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={24} color="white" />
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                  <Ionicons name="images" size={24} color="white" />
                  <Text style={styles.photoButtonText}>Upload Photo</Text>
                </TouchableOpacity>
              </View>

              {images.length > 0 && (
                <View style={styles.imagePreviewContainer}>
                  {images.map((uri, index) => (
                    <View key={index} style={styles.imagePreview}>
                      <Image source={{ uri }} style={styles.previewImage} />
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="#FF5722" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorMsg: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  mapContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapInfo: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  webLocationContainer: {
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLocationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  webLocationSubtext: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  photoButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
    flex: 0.48,
  },
  photoButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePreview: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportIncidentScreen; 