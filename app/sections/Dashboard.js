'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    AsyncStorage
} from 'react-native';
import {
    Axes,
    BarChart,
    LineChart,
    makeRange,
    generateScale
} from 'react-native-vs-charts'
import * as Animatable from 'react-native-animatable'
import HeatmapChart from '../components/HeatmapChart'
import FullBarChart from '../components/FullBarChart'

import gStyles from '../styles/global'

const GONIPLUS_ROOT_URI = 'https://dashboard.goniapm.io/api/goniplus/'
const SUFFIX_CPU = '/overview/dashboard/cpu'

export default class DashboardSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            CPUData: [],
            isCPULoaded: false,
            isTransectionLoaded: false,
            isActiveUserLoaded: false
        };
    }
    componentDidMount() {
        this._getDashboardCPU()
    }

    async _getDashboardCPU() {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);

                this.setState({
                    CPUData: this._processCPUData(responseJSON),
                    isCPULoaded: true
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+SUFFIX_CPU);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    _processCPUData(_data) {
        var timeList = []
        var aData = []
        var date = new Date();
        for (const i of Array(7).fill(0).map((_, i) => 6-i)) {
            if(date.getHours()<i) {
                timeList.push((date.getHours()-i+24)+':00')
            }else {
                timeList.push((date.getHours()-i)+':00')
            }
        }
        timeList.map((time) => {
            var temp = {}
            temp['time'] = time
            temp['hit'] = [0,0,0,0,0,0,0,0,0,0,0,0]
            aData.push(temp)
        })
        aData.map((item) => {
            for (const key of Object.keys(_data)) {
                var d = new Date(Number.parseInt(key)*1000);
                if(item['time'] == d.getHours()+':00') {
                    var index = Number.parseInt(d.getMinutes())/5
                    item['hit'][index] = Math.ceil(_data[key]/20)
                }
            }
        })
        return aData;
    }

    render() {
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>
                {this._renderCPU()}
                {this._renderActiveUser()}
                {this._renderTransection()}
            </ScrollView>
        );
    }

    _renderCPU() {
        if(this.state.isCPULoaded) {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" style={[gStyles.card, {paddingBottom: 20}]}>
                    <View style={{margin:10, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>System Status</Text>
                        <Text style={{marginLeft: 8, borderRadius: 2, borderColor: '#2c5ae9', borderWidth: 0.8, padding: 2, fontSize: 8, width: 35, textAlign: 'center', color: '#2c5ae9'}}>CPU</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <HeatmapChart
                        colorStream={['#E1E4E6', '#87b1f3', '#6b9df3', '#5188f2', '#3b72ef', '#2c5ae9']}
                        dataSet={this.state.CPUData}/>
                </Animatable.View>
            );
        }else {
            return(
                <Animatable.View animation="fadeInDown" easing="ease-out" style={gStyles.card}>
                    <View style={{margin:10, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>System Status</Text>
                        <Text style={{marginLeft: 8, borderRadius: 2, borderColor: '#2c5ae9', borderWidth: 0.8, padding: 2, fontSize: 8, width: 35, textAlign: 'center', color: '#2c5ae9'}}>CPU</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <View style={{flexDirection: 'column', alignItems: 'center', height: 250}}>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>
                                잠시만 기다려주세요
                            </Text>
                        </View>
                    </View>
                </Animatable.View>
            );
        }
    }

    _renderActiveUser() {
        if(this.state.isActiveUserLoaded) {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Active User</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Axes
                        style={{height: 150, paddingRight: 10}}
                        showCategoryTicks={false}
                        showValueGridlines={false}
                        valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                        categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                        valueLabelStyle={{color: '#a9afb3'}}
                        categoryLabelStyle={{fontSize: 8, color: '#a9afb3'}}
                        categoryAxisMode={'point'}
                        valueScale={{min: 0, max: 30, unit: 5}}
                        categoryLabels={['15:10','15:11','15:12','15:13','15:14','15:15','15:16','15:17','15:18','15:19','15:20']}>
                        <LineChart
                            lineWidth={1}
                            pointBorderWidth={1}
                            pointRadius={2}
                            categoryAxisMode={'range'}
                            datasets={testData1}
                            valueScale={{min: 0, max: 13, unit: 1}}
                        />
                    </Axes>
                </Animatable.View>
            );
        }else {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Active User</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <View style={{flexDirection: 'column', alignItems: 'center', height: 250}}>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>
                                Status Box를 선택해주세요
                            </Text>
                        </View>
                    </View>
                </Animatable.View>
            );
        }
    }

    _renderTransection() {
        if(this.state.isTransectionLoaded) {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Top 5 Transection</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <View>
                        <View>
                        </View>
                    </View>
                    <FullBarChart dataSet={[80,10,10]} barLabel={'api/asdfg/tester'}/>
                    <FullBarChart dataSet={[75,11,14]} barLabel={'api/asdfg/tester2'}/>
                    <FullBarChart dataSet={[78,13, 9]} barLabel={'api/asdfg/tester4'}/>
                    <FullBarChart dataSet={[74,12,14]} barLabel={'api/asdfg/tester3'}/>
                    <FullBarChart dataSet={[74,12,14]} barLabel={'api/asdfg/tester12'}/>
                </Animatable.View>
            );
        }else {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Top 5 Transection</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <View style={{flexDirection: 'column', alignItems: 'center', height: 250}}>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>
                                Status Box를 선택해주세요
                            </Text>
                        </View>
                    </View>
                </Animatable.View>
            );
        }
    }
}

var styles = StyleSheet.create({
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
