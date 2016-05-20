'use strict';

// import React elements
import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableHighlight,
    NavigatorIOS,
    TouchableWithoutFeedback,
    AsyncStorage,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Button from 'apsl-react-native-button';

import GoniProjects from './ProjectList';

// URL String for use goni api
const GONI_LOGIN_URL = 'https://dashboard.goniapm.io/api/auth';

// Goni Mobile View Component
export default class GoniMobileLogin extends Component {

    // constructor -> sett default state
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            email: 'test@layer123.io',
            password: 'test',
            testValue: ''
        };
    }

    _handleChangePage() {
        this.props.navigator.push({
            title: "GoniProjects",
            component: GoniProjects,
            passProps: {
                toggleNavBar: this.props.toggleNavBar,
            }
        });
    }

    _Login() {
        var params = "email="+this.state.email+"&password="+this.state.password;
        var request = new XMLHttpRequest();

        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);

                AsyncStorage.setItem('token', responseJSON['token'])
                .then(() => {
                    AsyncStorage.getItem('token').then((value) => {
                        Actions.GoniProjects();
                    }).done();
                });

            } else {
                console.warn('error');
            }
        };

        request.open('POST', GONI_LOGIN_URL, true);
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
        request.setRequestHeader("Cache-Control","no-cache, must-revalidate");
        request.setRequestHeader("Pragma","no-cache");
        request.send(params);
    }

    render() {
        return (
            <View style={{flexDirection: 'column', flex: 1, alignItems:'stretch'}}>
                <View style={{flex: 0.4, backgroundColor: '#363a3c'}}>
                </View>
                <View style={{flex: 0.6, backgroundColor: '#363a3c', padding: 40, paddingBottom: 10}}>
                    <View style={{flex: 1, alignItems:'stretch', padding: 0}}>
                        <View style={{flex: 0.4, alignItems:'stretch'}}>
                            <View style={{flex: 1}}></View>
                            <View style={{borderBottomColor:'white', borderBottomWidth: 1, marginBottom:15}}>
                                <TextInput
                                    placeholder={'E-mail'}
                                    placeholderTextColor={'#eaeeef'}
                                    style={{alignItems:'stretch', color: 'white', height: 40}}
                                    underlineColorAndroid='white'
                                    onChangeText={(text) => {this.setState({email: text})}}
                                />
                            </View>
                            <View style={{borderBottomColor:'white', borderBottomWidth: 1, marginBottom:15}}>
                                <TextInput
                                    placeholder={'Password'}
                                    placeholderTextColor={'#eaeeef'}
                                    style={{alignItems:'stretch', color: 'white', height: 40}}
                                    secureTextEntry={true}
                                    onChangeText={(text) => {this.setState({password: text})}}
                                />
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={{flex: 0.6, flexDirection:'column', alignItems: 'center'}}>
                            <View style={{flex: 1}}></View>
                            <Button
                                style={{borderColor: '#4c80f1', backgroundColor: '#4c80f1', borderRadius:30}}
                                textStyle={{fontSize: 18, color: 'white'}}
                                place
                                onPressOut={() => { this._Login(); }}>
                                Log in
                            </Button>
                            <View style={{flex: 1}}></View>
                            <Text style={{textAlign: 'center', color: '#ced3d6'}}>Forgot your password?</Text>
                        </View>
                    </View>
                    <Text>{this.state.testValue}</Text>
                </View>
                <KeyboardSpacer/>
            </View>
        );
    }
}
