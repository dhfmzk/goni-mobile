'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ScrollView,
    Picker,
    AsyncStorage
} from 'react-native';

import gStyles from '../styles/global'

const GONIPLUS_ROOT_URI = 'https://dashboard.goniapm.io/api/goniplus/'
const SUFFIX_EXPVAR = 'expvar/instances'
const SUFFIX_RUNTIME = 'runtime/instances'

export default class MetricsSection extends Component {

    constructor(props) {
        super(props);
        this._getMetricsInstance = this._getMetricsInstance.bind(this);
        this._getMetricsInstance(SUFFIX_EXPVAR)
        this._getMetricsInstance(SUFFIX_RUNTIME)
        this.state = {
            pathList: []
        };
    }

    async _getMetricsInstance(_metrics) {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                console.log(responseJSON);
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+'/'+_metrics);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    async _getRuntimeData(_instance) {

    }

    async _getExpvarData(_instance) {

    }

    render() {
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Select your Instance</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Picker
                        onValueChange={(lang) => this.setState({language: lang})}>
                        <Picker.Item label="Select Instance" value="none" />
                        <Picker.Item label="JavaScript" value="js" />
                    </Picker>
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
