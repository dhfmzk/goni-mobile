'use strict';

// import React elements
import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableHighlight,
    NavigatorIOS,
    TouchableWithoutFeedback
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Button from 'apsl-react-native-button';

import GoniDashboard from './Dashboard';

// URL String for use goni api
const GONI_HOME_URL = 'https://dashboard.goniapm.io/api';
const GONI_LOGIN_URL = 'https://dashboard.goniapm.io/api/auth';

// Goni Mobile View Component
export default class GoniMobileLogin extends Component {

    // constructor -> sett default state
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            email: 'test@layer123.io',
            passward: 'test',
            testValue: ''
        };
    }

    _handleChangePage() {
        this.props.navigator.push({
            title: "Dashboard",
            component: GoniDashboard,
            passProps: {
                toggleNavBar: this.props.toggleNavBar,
            }
        });
    }

    _Login() {
        var params = {
            userName: 'test@layer123.io',
            password: 'test'
        };
        var formData = new FormData();
        for (var k in params) {
            formData.append(k, params[k]);
        }

        fetch(GONI_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: formData
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState(
                {testValue: "cool"}
            );
        })
        .catch((err) => {
            console.warn(err);
            this.setState({
                testValue: this.state.email + " " + this.state.passward
            });
        })
        .done();
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
                            />
                            <Text style={{color: 'gray'}}>Passward</Text>
                            <TextInput
                                style={{borderRadius: 2, borderWidth: 1, borderColor: '#ced3d6', color: 'gray', backgroundColor: 'white', height:30}}
                                secureTextEntry={true}
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
