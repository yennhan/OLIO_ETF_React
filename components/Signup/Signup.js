import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,TouchableWithoutFeedback,Keyboard,
  TextInput,
  TouchableOpacity,
  View } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports';

const styles = require('./SignupStyles');

Amplify.configure({
  Auth: awsConfig
});

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: 'Password',
      email: 'Email',
      phone_number: 'Phone No',
      name: 'Name',
      errorMessage: ''
    };
    this.signupUser = this.signupUser.bind(this);
  }

  signupUser = () => {
    Auth.signUp({
      username: this.state.email,
      password: this.state.password,
      attributes: {
        email: this.state.email,
        phone_number: this.state.phone_number,
        name: this.state.name
      }
    })
      .then(data => { this.props.navigation.navigate('Confirmation', data) })
      .catch(err => { this.setState({ errorMessage: err.message }) })
  }

  render() {
    return(
      <KeyboardAvoidingView
        behaviour = 'padding'
        style = {styles.signup_container}
      >
        <ScrollView
          contentContainerStyle = {styles.signup_container}
          keyboardShouldPersistTaps = 'never'
        >
          <View style = {styles.signup_form_container}>
            <Text style={styles.signup_banner_text}>
              SIGN UP
            </Text>
            <Text>
              {this.state.errorMessage}
            </Text>
            <TextInput
              style = {styles.signup_input}
              onChangeText = {(name) => this.setState({name})}
              placeholder = "NAME"
              autoCapitalize = "none"
              onFocus = { () => this.setState({name: ""})}
              keyboardType = "default"
              underlineColorAndroid = "#fff"
            />
            <TextInput
              style = {styles.signup_input}
              onChangeText = {(email) => this.setState({email})}
              placeholder = "EMAIL ADDRESS"
              autoCapitalize = "none"
              onFocus = { () => this.setState({email: ""})}
              keyboardType = "email-address"
              underlineColorAndroid = "#fff"
            />
            <TextInput
              style = {styles.signup_input}
              onChangeText = {(phone_number) => this.setState({phone_number})}
              placeholder = "+60101235566"
              autoCapitalize = "none"
              returnKeyType='done'
              autoCorrect={false}
              onFocus = { () => this.setState({phone_number: ""})}
              keyboardType = "phone-pad"
              underlineColorAndroid = "#fff"
            />
            <TextInput
              style = {styles.signup_input}
              onChangeText = {(password) => this.setState({password})}
              placeholder = "PASSWORD"
              autoCapitalize = "none"
              onFocus = { () => {
                this.setState({password: ""});
                this.setState({errorMessage: "Passwords must contain symbols, uppercase and at least 8 characters lenght"})
              }}
              secureTextEntry = { true }
              underlineColorAndroid = "#fff"
            />
          </View>
          <View style = {styles.signup_actions_container}>
            <TouchableOpacity onPress = {()=> this.props.navigation.navigate('Signin')}>
              <Text style = {styles.login_button}>
                GO BACK
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress = {this.signupUser}
              style = {styles.signup_button}
            >
              <Text style = {styles.signup_text}>
                SIGNUP
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    )
  }
}