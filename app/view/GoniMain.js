'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import DashboardBar from '../components/DashboardBar';

import DashboardSection from '../sections/Dashboard'
import APISection from '../sections/API'
import MetricsSection from '../sections/Metrics'
import SettingSection from '../sections/Setting'

export default class GoniMain extends Component {

    constructor(prop) {
        super(prop)
        this.state = {
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{height:20, backgroundColor: '#2c5ae9'}}></View>
                <ScrollableTabView
                    tabBarPosition="top"
                    locked={true}
                    renderTabBar={() => <DashboardBar />}>
                    <DashboardSection
                        tabLabel="dashboard"
                        projectID={this.props.projectID}
                        projectKey={this.props.projectKey}/>
                    <APISection
                        tabLabel="api"
                        projectID={this.props.projectID}
                        projectKey={this.props.projectKey}/>
                    <MetricsSection
                        tabLabel="metrics"
                        projectID={this.props.projectID}
                        projectKey={this.props.projectKey}/>
                    <SettingSection
                        tabLabel="setting"
                        projectID={this.props.projectID}
                        projectKey={this.props.projectKey}/>
                </ScrollableTabView>
            </View>
        );
    }
}
