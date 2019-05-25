import React, { Component } from 'react';
import { ScrollableTabView, DefaultTabBar, ScrollableTabBar } from '@valdio/react-native-scrollable-tabview';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { debounce } from 'lodash'
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  View
} from 'react-native';
import * as shape from 'd3-shape'
import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../src/aws-exports'
import { Text as SvgText, Rect, G, Circle, Line, Svg, LinearGradient } from 'react-native-svg'
import { LineChart, Grid } from 'react-native-svg-charts'
import { Path } from 'react-native-svg'
//import { VictoryGroup, VictoryBar, VictoryLine, VictoryChart, VictoryVoronoiContainer, VictoryTooltip, VictoryAxis } from "victory-native";
import { ButtonGroup, Slider } from 'react-native-elements'


Amplify.configure({ Auth: awsConfig });

const styles = require('./ProfileStyles');

class DotFlyout extends React.Component {
  render() {
    const { datum, x, y, orientation } = this.props;
    return (
      <G>
        <Line x1={x} x2={x} y1={50} y2='90%' stroke="#0EBE2C" strokeWidth='1' />
        <Circle cx={x} cy={y} r="5" stroke={'#0EBE2C'} strokeWidth={0.5} fill="white" />
      </G>
      // <Svg height="400"
      //   width="100%">
      //   <G>
      //     <SvgText x={x} y={22} textAnchor="middle">{datum.high}</SvgText>
      //   </G>

      //   <SvgText x={x} y='95%' textAnchor="middle">{datum.label}</SvgText>
      // </Svg>
    );
  }
}

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.debounceUpdate = debounce( this.updateValue, 0 )
    this.state = {
      info: {},
      username: '',
      resetCode: '',
      newPassword: '',
      errorMessage: '',
      selectedIndex: 0,
      value:0,
      resetPassword: false,
      recoverButtonText: 'RECOVER',
      itemHistoryPrice: [],
      maxLength:0,
      startState:0,
    };
    this.resetPassword = this.resetPassword.bind(this);
  }
  updateValue(value) {
    this.setState({ value })
  }
  updateIndex = (selectedIndex) => {
    if (selectedIndex === 0) {
      this.getHistoryPrice('IEFN', '1W')
    }else if (selectedIndex === 1) {
      this.getHistoryPrice('IEFN','1M')
    }else if (selectedIndex === 2) {
      this.getHistoryPrice('IEFN','3M')
    }
    this.setState({ selectedIndex })
  }
  async componentDidMount() {
    const info = await Auth.currentUserInfo()
    //console.log('Returned info: ', info)
    this.setState({ info })
  }
  resetPassword = () => {
    if (this.state.resetPassword === true) {
      Auth.forgotPasswordSubmit(this.state.username, this.state.resetCode, this.state.newPassword)
        .then(() => { this.props.navigation.navigate('Login') })
        .catch(err => { this.setState({ errorMessage: err.message }) });
    } else {
      Auth.forgotPassword(this.state.username)
        .then(() => { this.setState({ resetPassword: true }) })
        .catch(err => { this.setState({ errorMessage: err.message }) });
    }
  }

  renderIf = (condition, content) => {
    if (condition) {
      return content;
    } else {
      return null;
    }
  }

  resetPasswordFields = () => {
    return (
      <View>
        <TextInput
          style={styles.forgot_password_input}
          onChangeText={(resetCode) => this.setState({ resetCode })}
          placeholder="RESET CODE"
          autoCapitalize="none"
          onFocus={() => this.setState({ resetCode: "" })}
          keyboardType="numeric"
          underlineColorAndroid="#fff" />
        <TextInput
          style={styles.forgot_password_input}
          onChangeText={(newPassword) => this.setState({ newPassword })}
          placeholder="NEW PASSWORD"
          autoCapitalize="none"
          onFocus={() => { this.setState({ newPassword: "" }); this.setState({ recoverButtonText: 'RESET' }) }}
          secureTextEntry={true}
          underlineColorAndroid="#fff" />
      </View>
    )
  }
  getHistoryPrice = (symbol, duration) => {
    const url = 'https://api.thecashguard.com/products/history/' + symbol + '/' + duration
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        this.setState({
          itemHistoryPrice: responseJSON,
          maxLength: responseJSON.length-1,
          startState:0
        });
      })
      .catch((error) => {
        console.log(error)

      })
  }
  tryTheData() {
    return this.state.itemHistoryPrice.map((item, index) => {
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ color: 'darkgray', marginTop: 5, paddingLeft: 20, width: "80%" }}>{item.date}</Text>
        <Text style={{ color: 'darkgray', marginTop: 5, paddingRight: 20, width: '20%' }}>{item.change}</Text>
      </View>
    })
  }


  renderUserPortfolio() {
    const data = this.state.itemHistoryPrice
    
    /**
     * Both below functions should preferably be their own React Components
     */
    const HorizontalLine = (({ x,y }) => (
      <Svg height="400" width="100%">
        <G>
      <Line
        key={'line-axis'}
        x1={x([this.state.value])}
        x2={x([this.state.value])}
        y1={40}
        y2={'90%'}
        stroke={'grey'}
        strokeDasharray={[7, 8]}
        strokeWidth={2}
      />
      <Circle
      key={ 'zero' }
      cx={ x(this.state.value) }
      cy={ y(data[this.state.value].high) }
      r={ 5 }
      stroke={'#0EBE2C'}
      fill={ 'white' }
  />
  <SvgText x={x([this.state.value])} y={20} textAnchor="middle">{data[this.state.value].high}</SvgText>
  <SvgText x={x([this.state.value])} y={'100%'} textAnchor="middle">{data[this.state.value].label}</SvgText>
  </G>
  
  </Svg>
    ))
    return (
      <LineChart
        style={{ padding: 5, height: 230 }}
        data={data}
        yAccessor={({ item }) => item.high}
        //xAccessor={({ item }) => item.date}
        svg={{
          stroke: '#0EBE2C',
          strokeWidth: 2,
        }}
        contentInset={{ left:10,top: 50, bottom: 30, right: 10 }}
        //curve={shape.curveNatural}
        curve={shape.curveLinear}
      >
        <HorizontalLine/>
      </LineChart>
       
    )
  }
  render() {
    const component1 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1W</Text>
    const component2 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1M</Text>
    const component3 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>3M</Text>
    const component4 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>6M</Text>
    const component5 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>1Y</Text>
    const component6 = () => <Text style={{ fontWeight: '500', color: 'black', fontSize: 14 }}>ALL</Text>
    const buttons = [{ element: component1 }, { element: component2 }, { element: component3 }, { element: component4 }, { element: component5 }, { element: component6 }]

    const { info } = this.state
    const { username, gender, birthdate } = info
    return (
      <SafeAreaView style={{ alignItem: 'center' }}>
        <View style={[styles.home_shadow, { width: '95%', height: 1000, margin: 10, borderRadius: 6, borderWidth: 1.5, backgroundColor: 'white', overflow: 'visible', borderColor: '#dddddd' }]}>
          {this.renderUserPortfolio()}
          <View style={{padding:10}}> 
          {/* <Text>{this.state.value}</Text> */}
          <Slider
            trackStyle={{height:0.5}}
            thumbStyle={{height:10,width:20}}
            animateTransitions={true}
            minimumTrackTintColor='gray'
            thumbTintColor = 'black'
            minimumValue = {this.state.startState}
            maximumValue={this.state.maxLength}
            step = {1}
            value={this.state.value}
            onValueChange={
            (value) => this.debounceUpdate(value)}
          />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={this.state.selectedIndex}
              buttons={buttons}
              selectedTextStyle={{ color: 'black' }}
              selectedButtonStyle={{ backgroundColor: 'white', borderBottomColor: '#0EBE2C', borderBottomWidth: 2.5 }}
              innerBorderStyle={{ color: 'white' }}
              containerStyle={{ paddingLeft: 10, paddingRight: 10, backgroundColor: 'white', borderColor: 'white', borderRadius: 0, borderWidth: 0, width: '95%', height: 40 }}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }
}