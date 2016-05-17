'use strict';

// import React elements
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    NavigatorIOS
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class GoniDashboard extends Component {

    // constructor -> sett state
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.token,
            user: this.props.user
        };
    }

    render() {
        return (
            <View style={{marginTop: 20, flex: 1}}>
                <ScrollableTabView
                    tabBarPosition={'bottom'}>
                    <View tabLabel="Expvar" />
                    <View tabLabel="Runtime" />
                    <View tabLabel="Response" />
                    <View tabLabel="Statistics" />
                    <View tabLabel="Setting" />
                </ScrollableTabView>
            </View>
        );
    }
}
