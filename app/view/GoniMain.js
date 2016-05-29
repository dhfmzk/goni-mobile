'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    NavigatorIOS,
    ScrollView
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FacebookTabBar from '../components/DashboardBar';

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
                    renderTabBar={() => <FacebookTabBar />}>
                    <DashboardSection tabLabel="dashboard" />
                    <APISection tabLabel="api" />
                    <MetricsSection tabLabel="metrics" />
                    <SettingSection tabLabel="setting" />
                </ScrollableTabView>
            </View>
        );
    }
}
