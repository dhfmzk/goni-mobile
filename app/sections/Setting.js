'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    AsyncStorage,
    Image
} from 'react-native';
import Button from 'apsl-react-native-button';

const GONI_SLACK_URL = 'https://dashboard.goniapm.io/api/project/1/notification/slack';
const GONI_MEMBER_URL = 'https://dashboard.goniapm.io/api/project/1/member';

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
        request.open('GET', GONI_SLACK_URL);
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
        request.open('GET', GONI_MEMBER_URL);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    render() {
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>
                <View style={styles.settingCard}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>TestAPI</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            style={{width: 180, height: 75}}
                            source={require('../assets/img/slack.png')}
                        />
                    </View>
                        <View style={{height:1, backgroundColor: 'gray', margin: 15, marginLeft: 20, marginRight: 20}}></View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 12, marginBottom:20}}>현재 Goni는 Slack notification을 지원하고 있습니다.</Text>
                        <Text>Send notification to {this.state.slackData['team_name']}{this.state.slackData['channel']}</Text>
                        <Text>Integrated @ {this.state.slackData['created_at']}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <Button
                            textStyle={{color: '#4c80f1', fontSize: 12}}
                            style={[styles.button, styles.blue]}>
                            Configure
                        </Button>
                        <Button
                            textStyle={{color: '#ff7595', fontSize: 12}}
                            style={[styles.button, styles.red]}>
                            Remove
                        </Button>
                    </View>
                </View>
                <View style={styles.settingCard}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Member</Text>
                    </View>
                    <View style={{height:0.5, backgroundColor: 'gray', margin: 15, marginLeft: 20, marginRight: 20}}></View>
                    <View>
                        <Text>이 프로젝트에 대한 정보들을 볼수있는 사람들입니다.</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
                        {this.state.memberData.map((data, i) => {
                            return (
                                <View key={i} style={{height: 30, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.1)'}}>
                                    <Text>
                                        {data.email}
                                    </Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

var styles = StyleSheet.create({
    settingCard: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        padding: 5,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3
    },
    button: {
        flex: 0.5,
        height: 30,
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
    }
})