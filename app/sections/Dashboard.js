'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ScrollView
} from 'react-native';

export default class DashboardSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>
                <View style={styles.settingCard}>
                    <Text>TestAPI Overview</Text>
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
