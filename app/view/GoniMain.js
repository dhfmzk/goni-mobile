'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    ScrollView,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ActionButton from 'react-native-action-button';

import DashboardBar from '../components/DashboardBar';

import DashboardSection from '../sections/Dashboard'
import APISection from '../sections/API'
import MetricsSection from '../sections/Metrics'
import SettingSection from '../sections/Setting'

export default class GoniMain extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{height:20, backgroundColor: '#2c5ae9'}}></View>
                <ScrollableTabView
                    tabBarPosition="top"
                    renderTabBar={() => <DashboardBar />}>
                    <DashboardSection tabLabel="dashboard" />
                    <APISection tabLabel="api" />
                    <MetricsSection tabLabel="metrics" />
                    <SettingSection tabLabel="setting" />
                </ScrollableTabView>
                <ActionButton buttonColor="#4c80f1">
                    <ActionButton.Item buttonColor='#4c80f1' title="Api path" onPress={() => console.log("notes tapped!")}>
                        <Image
                            style={{margin: 10, width: 20, height: 20, tintColor: 'white'}}
                            source={require('../assets/icon/left-arrow.png')}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Refresh" onPress={() => {}}>
                        <Image
                            style={{margin: 10, width: 20, height: 20, tintColor: 'white'}}
                            source={require('../assets/icon/left-arrow.png')}
                        />
                    </ActionButton.Item>
                </ActionButton>
            </View>
        );
    }
}
