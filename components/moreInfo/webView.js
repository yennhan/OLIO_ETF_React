
import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  SafeAreaView,
  TextInput,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  Image,
  Button,
  ImageBackground,
  View,
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';

export default class MyWeb extends Component {
  state = {
    error: "The Page you are trying to load can't be loaded..please"
  }

  render() {
    var { url } = this.props.navigation.state.params.theLink
    return (
      <WebView originWhitelist={['*']}
      source={{ uri: url }}
      renderError={errorName => <Error name={errorName} />}
      style={{ width: '100%', height:'100%',marginTop:20 }}/>
    );
  }
}