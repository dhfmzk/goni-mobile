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
            <View style={{marginTop: 20}}>
                <View>
                    <Text style={{textAlign: 'center'}}>Goni Dashboard</Text>
                </View>
            </View>
        );
    }
}
