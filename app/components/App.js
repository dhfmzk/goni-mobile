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
    AsyncStorage
} from 'react-native';
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
                        this._handleChangePage();
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
            <View style={{flex:1, alignItems:'center', marginTop: 20}}>
                <View>
                    <Text style={{textAlign: 'center'}}>Goni Mobile</Text>
                </View>
                <View style={{width: 300, borderRadius:5, borderColor: 'gray', borderWidth: 1}}>
                    <View style={{flex:1, alignItems:'center'}}>
                        <View style={{padding: 20}}>
                            <Text>{this.state.loggedin}</Text>
                        </View>
                        <View style={{width:250 ,padding: 20}}>
                            <Text style={{color: 'gray'}}>E-mail</Text>
                            <TextInput
                                style={{borderRadius: 2, borderWidth: 1, borderColor: '#ced3d6', marginBottom: 30, color: 'gray', backgroundColor: 'white', height:30}}
                                onChangeText={(text) => {this.setState({email: text})}}
                            />
                            <Text style={{color: 'gray'}}>Password</Text>
                            <TextInput
                                style={{borderRadius: 2, borderWidth: 1, borderColor: '#ced3d6', color: 'gray', backgroundColor: 'white', height:30}}
                                secureTextEntry={true}
                                onChangeText={(text) => {this.setState({password: text})}}
                            />
                        </View>
                        <View style={{marginBottom: 20, width: 200}}>
                            <Text style={{padding:30, textAlign: 'center', color: 'gray'}}>비밀번호를 잊으셨나요?</Text>
                            <Button
                                style={{borderColor: '#4c80f1', borderRadius:2}}
                                textStyle={{fontSize: 18, color: '#2c5ae9'}}
                                onPressOut={() => { this._Login(); }}>
                                로그인
                            </Button>
                            <Button
                                style={{borderColor: '#4c80f1', borderRadius:2}}
                                textStyle={{fontSize: 18, color: '#2c5ae9'}}
                                onPressOut={() => { this._handleChangePage(); }}>
                                로그인 스킵하기
                            </Button>
                        </View>
                    </View>
                    <Text>{this.state.testValue}</Text>
                </View>
                <KeyboardSpacer/>
            </View>
        );
    }
}
