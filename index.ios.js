'use strict'

import React, { Component } from 'react';
import {
    AppRegistry,
    NavigatorIOS
} from 'react-native';
import GoniMobileLogin from './app/view/App'

class goniMobile extends Component {

    render() {
        return (
            <NavigatorIOS ref = "nav"
                itemWrapperStyle={{flex:1}}
                style={{flex:1}}
                navigationBarHidden={true}
                initialRoute={{
                    title: "Login Page",
                    component: GoniMobileLogin,
                    passProps: {
                        toggleNavBar: this.toggleNavBar,
                    }
                }}/>
        );
    }
}
AppRegistry.registerComponent('goniMobile', () => goniMobile);
