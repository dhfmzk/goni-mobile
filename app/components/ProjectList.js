'use strict';

// import React elements
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    NavigatorIOS,
    AsyncStorage
} from 'react-native';
import Button from 'apsl-react-native-button';

const GONI_PROJECTS_URL = 'https://dashboard.goniapm.io/api/projects';

export default class GoniProjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            projectList: '';
        };
    }

    async _getProjectList() {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();

        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
            } else {
                console.warn('error');
            }
        };

        request.open('GET', GONI_PROJECTS_URL);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    render() {
        return (
            <View>
                <Text>Your Projects</Text>
                <Button
                    onPressOut={() => { this._getProjectList() }}>
                    test
                </Button>
            </View>
        );
    }
}
