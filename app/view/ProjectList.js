'use strict';

// import React elements
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    NavigatorIOS,
    AsyncStorage,
    ListView,
    Image
} from 'react-native';
import Button from 'apsl-react-native-button';

import GoniDashboard from './Dashboard'

const GONI_PROJECTS_URL = 'https://dashboard.goniapm.io/api/projects';

var testData =[
];

// Projects View Class
export default class GoniProjects extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this._ListItem = this._ListItem.bind(this);
        this._MoveDashboard = this._MoveDashboard.bind(this);
        this._getProjectList = this._getProjectList.bind(this);

        this._getProjectList()

        this.state = {
            token: '',
            testValue: '',
            dataSource: ds.cloneWithRows(this._processProjectDta(testData))
        };

    }

    _processProjectDta(projects) {
        projects.map((project) => {
            if(project['is_plus'] === 1) {
                project['is_plus'] = 'Goni+';
            }else {
                project['is_plus'] = 'Goni';
            }
            project['apikey'] = project['apikey'].substr(0,12);
        });

        return projects;
    }

    _MoveDashboard() {
        this.props.navigator.push({
            title: "GoniDashboard",
            component: GoniDashboard,
            passProps: {
                toggleNavBar: this.props.toggleNavBar,
            }
        });
    }

    async _getProjectList() {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                this.setState({
                    dataSource: ds.cloneWithRows(this._processProjectDta(responseJSON))
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONI_PROJECTS_URL);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    _ListItem(rowData) {
        return (
            <View style={{backgroundColor: 'white', margin: 10, borderWidth: 1, borderColor: '#e1e4e6'}}>
                <View style={{paddingLeft:10, paddingRight: 10, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', flex:1}}>
                    <View style={{ width: 60, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: '#a9afb3'}}>{rowData['is_plus']}</Text>
                        <Text style={{fontSize:20, color: '#a9afb3'}}>No.{rowData['id']}</Text>
                    </View>
                    <View style={{margin:10, flex: 1, marginLeft: 10}}>
                        <Text style={{fontSize:27}}>{rowData['name']}</Text>
                        <Text style={{fontSize: 8, padding: 3, color: '#2c5ae9', width: 100, borderColor: '#2c5ae9', borderWidth: 0.5, borderRadius: 2}}>APIKEY : {rowData['apikey']}</Text>
                    </View>
                    <TouchableHighlight
                        onPress={this._MoveDashboard}
                        style={{ width:50, alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                            style={{width:40, height: 40}}
                            source={require('../assets/img/goButton.png')}
                        />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{height: 20, backgroundColor: '#4c80f1'}}></View>
                <View style={{flex: 1, backgroundColor: '#363a3c', alignItems: 'stretch'}}>
                    <View style={{marginTop:20, marginBottom:0,  alignItems: 'center'}}>
                        <Text style={{fontSize: 30, marginBottom:10, color: '#a9afb3', textAlign: 'center'}}>
                            <Text style={{color: '#4c80f1'}}>Goni</Text>
                            <Text> Projects</Text>
                            <Text>{this.state.testValue}</Text>
                        </Text>
                        <Image
                            style={{width: 143, height: 90}}
                            source={require('../assets/img/goniair.png')}
                        />
                    </View>
                    <View style={{flex: 1, backgroundColor: 'white'}}>
                        <ListView
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={this._ListItem}
                            />
                    </View>
                </View>
            </View>
        );
    }
}