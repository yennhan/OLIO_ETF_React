const React = require('react-native');
const { Dimensions, StyleSheet } = React;

module.exports = StyleSheet.create({
  fullSize: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  confirmation_container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -10,
  },
  confirmation_code_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmation_text: {
    fontSize: 20,
    marginBottom: 20,
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: 10
  },
  confirmation_input: {
    width: 250,
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'left',
    fontSize: 14
  },
  confirmation_actions_container: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  login_button: {
    backgroundColor: '#fff',
    color: "lightgrey",
    width: 80,
    margin: 10,
    height: 30, 
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  confirmation_button: {
    backgroundColor: '#C4DE9F',
    width: Dimensions.get('window').width,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmation_button_text: {
    color: '#000',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 10
  },
});