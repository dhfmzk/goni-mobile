'use strict'

import React, { Component } from 'react';
import {
    AppRegistry,
    NavigatorIOS
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';

import GoniLogin from './app/view/Login';
import GoniProjects from './app/view/ProjectList';
import GoniDashboard from './app/view/Dashboard';

class goniMobile extends Component {

    render() {
        return (
            <Router>
                <Scene key="GoniLogin" component={GoniLogin}  title="GoniLogin" initial={true} hideNavBar={true} />
                <Scene key="GoniProjects" component={GoniProjects} title="GoniProjects" />
                <Scene key="GoniDashboard" component={GoniDashboard} title="GoniDashboard" />
            </Router>
        );
    }
}
AppRegistry.registerComponent('goniMobile', () => goniMobile);
