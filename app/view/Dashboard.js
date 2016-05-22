'use strict';

// import React elements
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

import SettingSection from '../view/Setting'

export default React.createClass({
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{height:20, backgroundColor: '#2c5ae9'}}></View>
                <ScrollableTabView
                    tabBarPosition="top"
                    renderTabBar={() => <FacebookTabBar />}>
                    <ScrollView tabLabel="dashboard" />
                    <ScrollView tabLabel="api" />
                    <ScrollView tabLabel="metrics" />
                    <SettingSection tabLabel="setting">
                    </SettingSection>
                </ScrollableTabView>
            </View>
        );
    }
})
