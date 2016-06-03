'use strict';

import React, { Component } from 'react';
import {
    Linking,
    StyleSheet,
    View,
    Text,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    Image
} from 'react-native';
import Button from 'apsl-react-native-button';
import { Actions } from 'react-native-router-flux';

import gStyles from '../styles/global';

const GONI_ROOT_URI = 'https://dashboard.goniapm.io/api/project/'
const SUFFIX_SLACK = '/notification/slack'
const SUFFIX_MEMBER = '/member'

export default class SettingSection extends Component {
    constructor(props) {
        super(props);
        this._getSlackData = this._getSlackData.bind(this);
        this._getMemberData = this._getMemberData.bind(this);
        this._getSlackData();
        this._getMemberData();
        this.state = {
            slackData: '',
            memberData: []
        };
    }
    componentDidMount() {
        var url = Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('Initial url is: ' + url);
            }
        }).catch(err => console.error('An error occurred', err));
}

    _logout() {
        Actions.GoniLogin();
    }

    async _getSlackData() {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                this.setState({
                    slackData: responseJSON
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONI_ROOT_URI+this.props.projectID+SUFFIX_SLACK);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    async _getMemberData() {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                this.setState({
                    memberData: responseJSON
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONI_ROOT_URI+this.props.projectID+SUFFIX_MEMBER);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    _Configure() {
        Linking.canOpenURL(this.state.slackData['configuration_url']).then(supported => {
            if (supported) {
                Linking.openURL(this.state.slackData['configuration_url']);
            } else {
                console.log('Don\'t know how to open URI: ' + this.state.slackData['configuration_url']);
            }
        });
    }

    render() {
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>TestAPI</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            style={{width: 180, height: 75}}
                            source={require('../assets/img/slack.png')}
                        />
                    </View>
                    <View style={{height:0.5, backgroundColor: 'gray', margin: 15, marginLeft: 20, marginRight: 20}}></View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 12, marginBottom:20, fontFamily: 'SpoqaHanSans'}}>Currently Goni supports Slack notification.</Text>
                        <Text>Send notification to {this.state.slackData['team_name']}{this.state.slackData['channel']}</Text>
                        <Text>Integrated @ {this.state.slackData['created_at']}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <TouchableOpacity
                            onPressOut={() => this._Configure()}
                            textStyle={{color: '#4c80f1', fontSize: 12}}
                            style={[styles.button, styles.blue]}>
                            <View style={{flex: 1, alignItems:'center', flexDirection: 'column'}}>
                                <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                                    <Text style={{fontSize: 12, color: '#4c80f1'}}>Configure</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            textStyle={{color: '#ff7595', fontSize: 12}}
                            style={[styles.button, styles.red]}>
                            <View style={{flex: 1, alignItems:'center', flexDirection: 'column'}}>
                                <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                                    <Text style={{fontSize: 12, color: '#ff7595'}}>Remove</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Member</Text>
                    </View>
                    <View style={styles.decoLine}></View>
                    <View>
                        <Text style={{textAlign: 'center', color: 'gray', marginBottom: 30}}>Members who participated in this project.</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
                        {this.state.memberData.map((data, i) => {
                            return (
                                <View key={i} style={{height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.1)', flexDirection: 'row' ,alignItems: 'center'}}>
                                    <Text style={{marginLeft: 10}}>
                                        {data.email}
                                    </Text>
                                    <View style={{flex:1}}></View>
                                    <TouchableOpacity
                                        style={[styles.button, {height: 20,flexDirection: 'row', alignItems:'center', borderColor: '#ff7595', borderWidth: 1}]}
                                        onPressOut={() => this._logout()}>
                                        <View style={{flex: 1, alignItems:'center'}}>
                                            <Text style={{fontSize: 12, color: '#ff7595'}}>Remove</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Log out</Text>
                    </View>
                    <View style={styles.decoLine}></View>
                    <View>
                        <Text style={{textAlign: 'center'}}>Are you sure you want to log out?</Text>
                    </View>
                    <View style={{padding: 40}}>
                        <TouchableOpacity
                            style={[styles.button, styles.red, {height: 50}]}
                            onPressOut={() => this._logout()}>
                            <View style={{flex: 1, alignItems:'center'}}>
                                <Text style={{fontSize: 20, color: '#ff7595'}}>
                                    Log out
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

var styles = StyleSheet.create({
    button: {
        flex: 0.5,
        height: 30,
        borderWidth: 1,
        borderColor: '#5f6466',
        borderRadius: 4,
        padding: 10,
        margin:10
    },
    red: {
        borderColor: '#ff7595'
    },
    blue: {
        borderColor: '#4c80f1'
    },
    decoLine: {
        height:0.5,
        backgroundColor: 'gray',
        margin: 15,
        marginLeft: 20,
        marginRight: 20
    }
})
