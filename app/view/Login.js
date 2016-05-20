'use strict';

// import React elements
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    AsyncStorage,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Button from 'apsl-react-native-button';

const GONI_LOGIN_URL = 'https://dashboard.goniapm.io/api/auth';

export default class GoniMobileLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            email: 'test@layer123.io',
            password: 'test',
            testValue: ''
        };
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
            <View style={styles.loginContainer}>
                <View style={styles.logoSection}>
                </View>
                <View style={styles.inputSection}>
                    <View style={styles.inputSectionLayout}>
                        <View style={styles.inputData}>
                            <View style={{flex: 1}}></View>
                            <View style={styles.inputDeco}>
                                <TextInput
                                    placeholder={'E-mail'}
                                    placeholderTextColor={'#eaeeef'}
                                    style={{color: 'white', height: 40}}
                                    underlineColorAndroid='white'
                                    onChangeText={(text) => {this.setState({email: text})}}
                                />
                            </View>
                            <View style={styles.inputDeco}>
                                <TextInput
                                    placeholder={'Password'}
                                    placeholderTextColor={'#eaeeef'}
                                    style={{color: 'white', height: 40}}
                                    secureTextEntry={true}
                                    onChangeText={(text) => {this.setState({password: text})}}
                                />
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={styles.buttonGroup}>
                            <View style={{flex: 1}}></View>
                            <Button
                                style={styles.loginButton}
                                textStyle={{fontSize: 18, color: 'white'}}
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

var styles = StyleSheet.create({
    loginContainer: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'stretch'
    },
    logoSection: {
        flex: 0.4,
        backgroundColor: '#363a3c'
    },
    inputSection: {
        flex: 0.6,
        backgroundColor: '#363a3c',
        padding: 40,
        paddingBottom: 10
    },
    inputSectionLayout: {
        flex: 1,
        alignItems: 'stretch',
        padding: 0
    },
    inputData: {
        flex: 0.4,
        alignItems:'stretch'
    },
    inputDeco: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        marginBottom: 15
    },
    buttonGroup: {
        flex: 0.6,
        flexDirection:'column',
        alignItems: 'center'
    },
    loginButton: {
        borderColor: '#4c80f1',
        backgroundColor: '#4c80f1',
        borderRadius:30
    }
})
