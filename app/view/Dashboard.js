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

export default React.createClass({

    // constructor -> sett state
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         token: this.props.token,
    //         user: this.props.user
    //     };
    // }

    render() {
        return (
            <ScrollableTabView
                tabBarPosition="bottom"
                renderTabBar={() => <FacebookTabBar />}>
                <ScrollView tabLabel="Dashboard" />
                <ScrollView tabLabel="Flow" />
                <ScrollView tabLabel="Jest" />
            </ScrollableTabView>
        );
    }
})
