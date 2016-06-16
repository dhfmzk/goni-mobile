'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    AsyncStorage,
    Picker,
    Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable'
import {
    Axes,
    makeRange,
    generateScale
} from 'react-native-vs-charts'

import gStyles from '../styles/global'

const GONIPLUS_ROOT_URI = 'https://dashboard.goniapm.io/api/goniplus/'
const SUFFIX_PATH = '/response/paths'
const SUFFIX_RESPONSE = '/response/30m'
const SUFFIX_STATICS = '/response/statistics/6h'

export default class APISection extends Component {

    constructor(props) {
        super(props);
        this._getApiPath = this._getApiPath.bind(this);
        this._getApiPath()
        this.state = {
            pathList: [],
            transactionData: [],
            responseData: {
                overview: { min: 'no data', mean: 'no data', max: 'no data', panic: 0 },
                graph: {
                    dataset: { yScale: { max: 10 }, range: {n: 'test', m: 'test'}},
                    data: []
                }
            },
            selectPath: 'none',
            dotData: [{x: 30, y: 100}, {x: 50, y: 120}, {x: 30, y: 100}, {x: 70, y: 133}]
        };
    }

    async _getApiPath() {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                console.log(responseJSON);
                this.setState({
                    pathList: responseJSON
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+SUFFIX_PATH);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    async _getApiResponse(_data) {
        var prams = 'path='+_data.replace(' /', '+%2F')
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                this.setState({
                    responseData: this._processResponse(responseJSON)
                })
            } else {
                console.warn('error');
            }
        };
        request.open('POST', GONIPLUS_ROOT_URI+this.props.projectKey+SUFFIX_RESPONSE, true);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send(prams);
    }

    _processResponse(_data) {
        var result = {}

        // processing overview data
        result['overview'] = _data['overview']

        //processing dot graph data
        var temp = []
        var dataset = {}
        var scale = new Date(_data['responsemap'][0]['time'])
        var yMax = 0
        _data['responsemap'].map((item, key) => {
            if(item['res'] > yMax) { yMax = item['res'] }
            var date = new Date(item['time'])
            temp.push({time: date.valueOf()-scale, res: item['res'], color: item['status']})
        })
        var xMax = temp[temp.length-1]['time']

        dataset['xScale'] = {min: 0, max: xMax}
        dataset['yScale'] = {min: 0, max: yMax}
        dataset['range'] = {
            n: scale.toString().match(/[0-9]{2}:[0-9]{2}:/)[0].substr(0,5),
            m: _data['responsemap'][_data['responsemap'].length-1]['time'].match(/[0-9]{2}:[0-9]{2}:/)[0].substr(0,5)
        }
        result['graph'] = { dataset: dataset, data: temp }
        console.log(result);

        return result
    }

    async _getApiStatics() {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                this.setState({
                    transactionData: responseJSON
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+SUFFIX_RESPONSE);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    render() {
        var {height, width} = Dimensions.get('window');
        var scale = width-132
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Select your path</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Picker
                        style={{height: 200}}
                        refresh={this.state.pathList}
                        selectedValue={this.state.selectPath}
                        onValueChange={(path) => {
                            this.setState({ selectPath: path })
                            this._getApiResponse(path)
                        }}>
                        <Picker.Item style={{color: '#ced3d6'}} label="Select your path" value="none" />
                        {this.state.pathList.map((item) => {
                            return ( <Picker.Item key={item['label']} label={item['label']} value={item['label']} /> )
                        })}
                    </Picker>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Overview</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <View refresh={this.state.responseData} style={{margin: 10, flexDirection: 'column'}}>
                        <View style={{flex: 1, flexDirection: 'row', margin: 5, height: 50, alignItems: 'center', marginRight: 40, marginLeft: 40}}>
                            <View style={{flex: 0.5, padding: 10, backgroundColor: '#4c80f1', borderColor: '#4c80f1', borderRadius: 5}}>
                                <Text style={{flex: 1, fontSize: 20, color: 'white'}}>Min</Text>
                            </View>
                            <View>
                                <Text style={{flex: 0.5, padding: 10, backgroundColor: '#e1e4e6'}}>{this.state.responseData['overview']['max']}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', margin: 5, height: 60, alignItems: 'center', marginRight: 40, marginLeft: 40}}>
                            <View style={{flex: 1, width: 100, padding: 10, backgroundColor: '#7cd06b', borderColor: '#7cd06b', borderRadius: 5}}>
                                <Text style={{fontSize: 20, color: 'white'}}>Average</Text>
                            </View>
                            <View>
                                <Text style={{flex: 1, padding: 10, backgroundColor: '#e1e4e6'}}>{this.state.responseData['overview']['mean']}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', margin: 5, height: 60, alignItems: 'center', marginRight: 40, marginLeft: 40}}>
                            <View style={{flex: 1, width: 100, padding: 10, backgroundColor: '#ffda00', borderColor: '#ffda00', borderRadius: 5}}>
                                <Text style={{fontSize: 20, color: 'white'}}>Max</Text>
                            </View>
                            <View>
                                <Text style={{flex: 1, padding: 10, backgroundColor: '#e1e4e6'}}>{this.state.responseData['overview']['max']}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', margin: 5, height: 60, alignItems: 'center', marginRight: 40, marginLeft: 40}}>
                            <View style={{flex: 1, width: 100, padding: 10, backgroundColor: '#ff7595', borderColor: '#ff7595', borderRadius: 5}}>
                                <Text style={{fontSize: 20, color: 'white'}}>Panic</Text>
                            </View>
                            <View>
                                <Text style={{flex: 1, padding: 10, backgroundColor: '#e1e4e6'}}>{this.state.responseData['overview']['panic']}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Response Time</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out" style={{flex: 1, height: 50}}>
                        <View style={{flexDirection: 'column', alignItems: 'center', height: 30}}>
                            <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{marginLeft: 5, marginRight: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{color: '#a9afb3', fontSize: 10}}>200</Text>
                                    <View style={{marginLeft: 5, marginRight: 10, width:10, height: 10, backgroundColor: '#4c80f1', borderRadius: 10}}></View>
                                </View>
                                <View style={{marginLeft: 10, marginRight: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{color: '#a9afb3', fontSize: 10}}>401</Text>
                                    <View style={{marginLeft: 5, marginRight: 5, width:10, height: 10, backgroundColor: '#ffda00', borderRadius: 10}}></View>
                                </View>
                                <View style={{marginLeft: 10, marginRight: 5, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{color: '#a9afb3', fontSize: 10}}>500</Text>
                                    <View style={{marginLeft: 5, marginRight: 5, width:10, height: 10, backgroundColor: '#ff7595', borderRadius: 10}}></View>
                                </View>
                            </View>
                        </View>
                    </Animatable.View>
                    <View style={{marginLeft: 10, marginRight:20, height: 170, flex: 1, flexDirection: 'row'}}>
                        <Axes
                            refresh={this.state.responseData}
                            style={{flex: 1, height: 170}}
                            showCategoryGridlines={true}
                            showValueGridlines={true}
                            valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                            categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                            valueLabelStyle={{color: '#a9afb3', fontSize: 10}}
                            valueScale={{min:0, max: this.state.responseData['graph']['dataset']['yScale']['max'], unit: Math.ceil(this.state.responseData['graph']['dataset']['yScale']['max']/8)}}
                            categoryLabels={[this.state.responseData['graph']['dataset']['range']['n'], this.state.responseData['graph']['dataset']['range']['m'],]}
                            categoryAxisMode={'point'}>
                            <View style={{flex: 1}}>
                                {this.state.responseData['graph']['data'].map((item, key) => {
                                        var xScale = scale/this.state.responseData['graph']['dataset']['xScale']['max']
                                        var yScale = 130/this.state.responseData['graph']['dataset']['yScale']['max']
                                        var color = '#ced3d6'
                                        if(item['color'] == 200) { color = '#4c80f1' }
                                        if(item['color'] == 401 || item['color'] == 400) { color = '#ffda00' }
                                        if(item['color'] == 500) { color = '#ff7595' }
                                        return (
                                            <View
                                                key={key}
                                                style={{width: 0, height: 0, borderWidth: 2, borderRadius: 2, borderColor: color, position: 'absolute', left: xScale*item['time'], bottom: yScale*item['res']}}/>
                                        );
                                })}
                            </View>
                        </Axes>
                    </View>
                </View>
            </ScrollView>
        );
    }

    _responseRender(_data) {
        var tester = [0, 1, 2, 3]
        var blueDeg = []
        var yellowDeg = []
        var redDeg = []
        var temp = []
        temp.push(_data[0] * 3.6)
        temp.push(_data[1] * 3.6)
        temp.push(_data[2] * 3.6)
        tester.forEach((i) => {
            if(temp[0] > 0){
                blueDeg.push(temp[0])
                temp[0] -= 80
            }else {
                blueDeg.push(0)
            }
        })
        tester.forEach((i) => {
            if(temp[1] > 0){
                yellowDeg.push(temp[1])
                temp[1] -= 80
            }else {
                yellowDeg.push(0)
            }
        })
        tester.forEach((i) => {
            if(temp[2] > 0){
                redDeg.push(temp[2])
                temp[2] -= 80
            }else {
                redDeg.push(0)
            }
        })
        console.log(blueDeg);
        console.log(yellowDeg);
        console.log(redDeg);

        return (
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', height: 250}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',width: 250}}>
                    <View style={[styles.coneblue, {transform: [{rotate: blueDeg[0]+'deg'}]}]}></View>
                    <View style={[styles.coneblue, {transform: [{rotate: blueDeg[1]+'deg'}]}]}></View>
                    <View style={[styles.coneblue, {transform: [{rotate: blueDeg[2]+'deg'}]}]}></View>
                    <View style={[styles.coneblue, {transform: [{rotate: blueDeg[3]+'deg'}]}]}></View>
                    <View style={[styles.coneblue, {transform: [{rotate: blueDeg[4]+'deg'}]}]}></View>

                    <View style={[styles.conegreen, {transform: [{rotate: (yellowDeg[0]+blueDeg[0]+45)+'deg'}]}]}></View>
                    <View style={[styles.conegreen, {transform: [{rotate: (yellowDeg[1]+blueDeg[0]+45)+'deg'}]}]}></View>
                    <View style={[styles.conegreen, {transform: [{rotate: (yellowDeg[2]+blueDeg[0]+45)+'deg'}]}]}></View>
                    <View style={[styles.conegreen, {transform: [{rotate: (yellowDeg[3]+blueDeg[0]+45)+'deg'}]}]}></View>
                    <View style={[styles.conegreen, {transform: [{rotate: (yellowDeg[4]+blueDeg[0]+45)+'deg'}]}]}></View>

                    <View style={[styles.conegred, {transform: [{rotate: (redDeg[0]+yellowDeg[0]+blueDeg[0]+45)+'deg'}]}]}></View>
                    <View style={[styles.conegred, {transform: [{rotate: (redDeg[1]+yellowDeg[0]+blueDeg[0]+45)+'deg'}]}]}></View>
                    <View style={[styles.conegred, {transform: [{rotate: (redDeg[2]+yellowDeg[0]+blueDeg[0]+45)+'deg'}]}]}></View>
                    <View style={[styles.conegred, {transform: [{rotate: (redDeg[3]+yellowDeg[0]+blueDeg[0]+45)+'deg'}]}]}></View>
                    <View style={[styles.conegred, {transform: [{rotate: (redDeg[4]+yellowDeg[0]+blueDeg[0]+45)+'deg'}]}]}></View>

                    <View style={[styles.coneblue, {transform: [{rotate: '45deg'}]}]}></View>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    coneblue: {
        width: 0,
        height: 0,
        borderLeftWidth: 100,
        borderLeftColor: 'transparent',
        borderRightWidth: 100,
        borderRightColor: 'transparent',
        borderTopWidth: 100,
        borderTopColor: '#4c80f1',
        borderBottomWidth: 100,
        borderBottomColor: 'transparent',
        borderRadius: 100,
        position: 'absolute',
        left: 25,
        top: 25
    },
    conegreen: {
        transform: [{rotate: '70deg'}],
        width: 0,
        height: 0,
        borderLeftWidth: 100,
        borderLeftColor: 'transparent',
        borderRightWidth: 100,
        borderRightColor: 'transparent',
        borderTopWidth: 100,
        borderTopColor: '#ffda00',
        borderBottomWidth: 100,
        borderBottomColor: 'transparent',
        borderRadius: 100,
        position: 'absolute',
        left: 25,
        top: 25
    },
    conegred: {
        transform: [{rotate: '70deg'}],
        width: 0,
        height: 0,
        borderLeftWidth: 100,
        borderLeftColor: 'transparent',
        borderRightWidth: 100,
        borderRightColor: 'transparent',
        borderTopWidth: 100,
        borderTopColor: '#ff7595',
        borderBottomWidth: 100,
        borderBottomColor: 'transparent',
        borderRadius: 100,
        position: 'absolute',
        left: 25,
        top: 25
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
