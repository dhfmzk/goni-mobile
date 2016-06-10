'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ScrollView,
    Picker,
    AsyncStorage
} from 'react-native';
import {
    Axes,
    LineChart,
    makeRange,
    generateScale
} from 'react-native-vs-charts'
import * as Animatable from 'react-native-animatable'

import gStyles from '../styles/global'

const GONIPLUS_ROOT_URI = 'https://dashboard.goniapm.io/api/goniplus/'
const SUFFIX_EXPVAR = '/expvar/'
const SUFFIX_RUNTIME = '/runtime/'

export default class MetricsSection extends Component {

    constructor(props) {
        super(props);
        this._getMetricsInstance = this._getMetricsInstance.bind(this);
        this._getMetricsInstance(SUFFIX_EXPVAR)
        this._getMetricsInstance(SUFFIX_RUNTIME)
        this.state = {
            instanceList: [],
            selectInstance: '',
            expvarData: {
                alloc: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                },
                heapalloc: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                },
                numgc: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                },
                pausetotalns: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                },
                sys: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                }
            }
        };
    }

    async _getMetricsInstance(_metrics) {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                this.setState({
                    instanceList: responseJSON
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+_metrics+'instances');
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    async _getExpvarData(_instance) {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                this.setState({
                    expvarData: this._processExpvarData(responseJSON)
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+SUFFIX_EXPVAR+_instance+'/30m');
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    _processExpvarData(_data) {
        this.setState({
            expvarData: {
                alloc: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                },
                heapalloc: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                },
                numgc: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                },
                pausetotalns: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                },
                sys: {
                    data: [
                        { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
                    ],
                    scale: { min: 0, max: 10, unit: 1 },
                    label: []
                }
            }
        })
        var result = {}
        var label = []
        var max = 0
        var min = 0
        // alloc
        result['alloc'] = {
            data: [
                { name: 'alloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
            ],
            scale: { min: 0, max: 10, unit: 1 },
            label: []
        }
        _data['alloc'].forEach((item) => {
            result['alloc']['data'][0]['values'].push(item['alloc'])
            if(result['alloc']['label'].length % 28 === 0) {
                result['alloc']['label'].push(item['time'].match(/[0-9]{2}:[0-9]{2}:/)[0].substr(0,5))
            }else {
                result['alloc']['label'].push('')
            }
            if(item['alloc'] > max) { max = item['alloc'] }
        })
        result['alloc']['scale'] = {min: 0, max: max, unit: Math.ceil(max/10)}

        // heepalloc
        label = []
        max = 0
        result['heapalloc'] = {
            data: [
                { name: 'heapalloc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
            ],
            scale: { min: 0, max: 10, unit: 1 },
            label: []
        }
        _data['heapalloc'].forEach((item) => {
            result['heapalloc']['data'][0]['values'].push(item['heapalloc'])
            if(result['heapalloc']['label'].length % 28 === 0) {
                result['heapalloc']['label'].push(item['time'].match(/[0-9]{2}:[0-9]{2}:/)[0].substr(0,5))
            }else {
                result['heapalloc']['label'].push('')
            }
            if(item['heapalloc'] > max) { max = item['heapalloc'] }
        })
        result['heapalloc']['scale'] = {min: 0, max: max, unit: Math.ceil(max/10)}

        // numgc
        label = []
        max = 0
        min = _data['numgc'][0]['numgc']
        result['numgc'] = {
            data: [
                { name: 'numgc', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
            ],
            scale: { min: 0, max: 10, unit: 1 },
            label: []
        }
        _data['numgc'].forEach((item) => {
            result['numgc']['data'][0]['values'].push(item['numgc'])
            if(result['numgc']['label'].length % 28 === 0) {
                result['numgc']['label'].push(item['time'].match(/[0-9]{2}:[0-9]{2}:/)[0].substr(0,5))
            }else {
                result['numgc']['label'].push('')
            }
            if(item['numgc'] > max) { max = item['numgc'] }
            if(item['numgc'] < min) { min = item['numgc'] }
        })
        result['numgc']['scale'] = {min: min, max: max, unit: Math.ceil((max-min)/10)}

        // pausetotalns
        label = []
        max = 0
        min = _data['pausetotalns'][0]['pausetotalns']
        result['pausetotalns'] = {
            data: [
                { name: 'pausetotalns', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
            ],
            scale: { min: 0, max: 10, unit: 1 },
            label: []
        }
        _data['pausetotalns'].forEach((item) => {
            result['pausetotalns']['data'][0]['values'].push(item['pausetotalns'])
            if(result['pausetotalns']['label'].length % 28 === 0) {
                result['pausetotalns']['label'].push(item['time'].match(/[0-9]{2}:[0-9]{2}:/)[0].substr(0,5))
            }else {
                result['pausetotalns']['label'].push('')
            }
            if(item['pausetotalns'] > max) { max = item['pausetotalns'] }
            if(item['pausetotalns'] < min) { min = item['pausetotalns'] }
        })
        result['pausetotalns']['scale'] = {min: min, max: max, unit: Math.ceil((max-min)/10)}

        // sys
        label = []
        max = 0
        min = _data['sys'][0]['sys']
        result['sys'] = {
            data: [
                { name: 'sys', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [] }
            ],
            scale: { min: 0, max: 10, unit: 1 },
            label: []
        }
        _data['sys'].forEach((item) => {
            result['sys']['data'][0]['values'].push(item['sys'])
            if(result['sys']['label'].length % 28 === 0) {
                result['sys']['label'].push(item['time'].match(/[0-9]{2}:[0-9]{2}:/)[0].substr(0,5))
            }else {
                result['sys']['label'].push('')
            }
            if(item['sys'] > max) { max = item['sys'] }
            if(item['sys'] < min) { min = item['sys'] }
        })
        result['sys']['scale'] = {min: 0, max: max, unit: Math.ceil(max/10) }
        console.log(result);

        return result
    }

    async _getRuntimeData(_instance) {

    }

    render() {
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Select your Instance</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Picker
                        style={{height: 200}}
                        refresh={this.state.instanceList}
                        selectedValue={this.state.selectInstance}
                        onValueChange={(inst) => {
                            this.setState({ selectInstance: inst })
                            this._getRuntimeData(inst)
                            this._getExpvarData(inst)
                        }}>
                        <Picker.Item style={{color: '#ced3d6'}} label="Select your instance" value="none" />
                        {this.state.instanceList.map((item) => {
                            return ( <Picker.Item key={item['label']} label={item['label']} value={item['label']} /> )
                        })}
                    </Picker>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>alloc</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out">
                        <Axes
                            refresh={this.state.expvarData}
                            style={{flex:1, height: 200, paddingRight: 10}}
                            showCategoryTicks={false}
                            showValueGridlines={false}
                            showCategoryGridlines={false}
                            valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                            categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                            valueLabelStyle={{fontSize: 5, color: '#a9afb3'}}
                            categoryLabelStyle={{fontSize: 10, overflow: 'visible', color: '#a9afb3'}}
                            categoryAxisMode={'point'}
                            valueScale={this.state.expvarData['alloc']['scale']}
                            categoryLabels={this.state.expvarData['alloc']['label']}
                            datasets={this.state.expvarData['alloc']['data']}>
                            <LineChart
                                refresh={this.state.expvarData}
                                lineWidth={1}
                                pointBorderWidth={1}
                                pointRadius={2}
                                categoryAxisMode={'range'}
                                datasets={this.state.expvarData['alloc']['data']}
                                valueScale={this.state.expvarData['alloc']['scale']}
                            />
                        </Axes>
                    </Animatable.View>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>heapalloc</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out">
                        <Axes
                            refresh={this.state.expvarData}
                            style={{flex:1, height: 200, paddingRight: 10}}
                            showCategoryTicks={false}
                            showValueGridlines={false}
                            showCategoryGridlines={false}
                            valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                            categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                            valueLabelStyle={{fontSize: 5, color: '#a9afb3'}}
                            categoryLabelStyle={{fontSize: 10, overflow: 'visible', color: '#a9afb3'}}
                            categoryAxisMode={'point'}
                            valueScale={this.state.expvarData['heapalloc']['scale']}
                            categoryLabels={this.state.expvarData['heapalloc']['label']}
                            datasets={this.state.expvarData['heapalloc']['data']}>
                            <LineChart
                                refresh={this.state.expvarData}
                                lineWidth={1}
                                pointBorderWidth={1}
                                pointRadius={2}
                                categoryAxisMode={'range'}
                                datasets={this.state.expvarData['heapalloc']['data']}
                                valueScale={this.state.expvarData['heapalloc']['scale']}
                            />
                        </Axes>
                    </Animatable.View>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>numgc</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out">
                        <Axes
                            refresh={this.state.expvarData}
                            style={{flex:1, height: 200, paddingRight: 10}}
                            showCategoryTicks={false}
                            showValueGridlines={false}
                            showCategoryGridlines={false}
                            valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                            categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                            valueLabelStyle={{fontSize: 5, color: '#a9afb3'}}
                            categoryLabelStyle={{fontSize: 10, overflow: 'visible', color: '#a9afb3'}}
                            categoryAxisMode={'point'}
                            valueScale={this.state.expvarData['numgc']['scale']}
                            categoryLabels={this.state.expvarData['numgc']['label']}
                            datasets={this.state.expvarData['numgc']['data']}>
                            <LineChart
                                refresh={this.state.expvarData}
                                lineWidth={1}
                                pointBorderWidth={1}
                                pointRadius={2}
                                categoryAxisMode={'range'}
                                datasets={this.state.expvarData['numgc']['data']}
                                valueScale={this.state.expvarData['numgc']['scale']}
                            />
                        </Axes>
                    </Animatable.View>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>pausetotalns</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out">
                        <Axes
                            refresh={this.state.expvarData}
                            style={{flex:1, height: 200, paddingRight: 10}}
                            showCategoryTicks={false}
                            showValueGridlines={false}
                            showCategoryGridlines={false}
                            valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                            categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                            valueLabelStyle={{fontSize: 5, color: '#a9afb3'}}
                            categoryLabelStyle={{fontSize: 10, overflow: 'visible', color: '#a9afb3'}}
                            categoryAxisMode={'point'}
                            valueScale={this.state.expvarData['pausetotalns']['scale']}
                            categoryLabels={this.state.expvarData['pausetotalns']['label']}
                            datasets={this.state.expvarData['pausetotalns']['data']}>
                            <LineChart
                                refresh={this.state.expvarData}
                                lineWidth={1}
                                pointBorderWidth={1}
                                pointRadius={2}
                                categoryAxisMode={'range'}
                                datasets={this.state.expvarData['pausetotalns']['data']}
                                valueScale={this.state.expvarData['pausetotalns']['scale']}
                            />
                        </Axes>
                    </Animatable.View>
                </View>
                <View style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>pausetotalns</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out">
                        <Axes
                            refresh={this.state.expvarData}
                            style={{flex:1, height: 200, paddingRight: 10}}
                            showCategoryTicks={false}
                            showValueGridlines={false}
                            showCategoryGridlines={false}
                            valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                            categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                            valueLabelStyle={{fontSize: 5, color: '#a9afb3'}}
                            categoryLabelStyle={{fontSize: 10, overflow: 'visible', color: '#a9afb3'}}
                            categoryAxisMode={'point'}
                            valueScale={this.state.expvarData['sys']['scale']}
                            categoryLabels={this.state.expvarData['sys']['label']}
                            datasets={this.state.expvarData['sys']['data']}>
                            <LineChart
                                refresh={this.state.expvarData}
                                lineWidth={1}
                                pointBorderWidth={1}
                                pointRadius={2}
                                categoryAxisMode={'range'}
                                datasets={this.state.expvarData['sys']['data']}
                                valueScale={this.state.expvarData['sys']['scale']}
                            />
                        </Axes>
                    </Animatable.View>
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
