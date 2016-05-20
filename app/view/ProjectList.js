'use strict';

// import React elements
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    AsyncStorage,
    ListView,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from 'apsl-react-native-button';
import * as Animatable from 'react-native-animatable';

const GONI_PROJECTS_URL = 'https://dashboard.goniapm.io/api/projects';

var testData =[
];

// Projects View Class
export default class GoniProjects extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this._ListItem = this._ListItem.bind(this);
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
            <Animatable.View
                animation="fadeInDown"
                easing="ease-in-out"
                duration={500}
                style={styles.apiCard}>
                <View style={styles.cardLayout}>
                    <View style={styles.projectNum}>
                        <Text style={{color: '#a9afb3'}}>{rowData['is_plus']}</Text>
                        <Text style={{fontSize:20, color: '#a9afb3'}}>No.{rowData['id']}</Text>
                    </View>
                    <View style={styles.projectInfo}>
                        <Text style={{fontSize:27}}>{rowData['name']}</Text>
                        <Text style={{fontSize: 8, padding: 3, color: '#2c5ae9', width: 100, borderColor: '#2c5ae9', borderWidth: 0.5, borderRadius: 2}}>APIKEY : {rowData['apikey']}</Text>
                    </View>
                    <TouchableHighlight
                        onPress={() => Actions.GoniDashboard()}
                        style={{ width:50, alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                            style={{width:40, height: 40}}
                            source={require('../assets/img/goButton.png')}
                        />
                    </TouchableHighlight>
                </View>
            </Animatable.View>
        );
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{height: 20, backgroundColor: '#4c80f1'}}></View>
                <View style={{flex: 1, backgroundColor: '#363a3c', alignItems: 'stretch'}}>
                    <View style={{flex: 1, backgroundColor: '#f8fafb'}}>
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

var styles = StyleSheet.create({
    apiCard: {
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
    cardLayout: {
        paddingLeft:5,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        flex:1
    },
    projectNum: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    projectInfo: {
        margin:10,
        flex: 1,
        marginLeft: 10
    }
})
