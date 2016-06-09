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
import Spinner from 'react-native-spinkit'
import HeatmapChart from '../components/HeatmapChart'
import FullBarChart from '../components/FullBarChart'

import gStyles from '../styles/global'

const GONIPLUS_ROOT_URI = 'https://dashboard.goniapm.io/api/goniplus/'
const SUFFIX_CPU = '/overview/dashboard/cpu'

var testData1 = [
    {name: 'test1', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]}
]
var testData2 = [
    {name: '200', primaryColor: '#7cd06b', secondaryColor: 'white', values: [68,73,71,62,89]},
    {name: '401', primaryColor: '#ffda00', secondaryColor: 'white', values: [20,13,24,15, 6]},
    {name: '500', primaryColor: '#ff7595', secondaryColor: 'white', values: [12,14, 5,23, 5]}
]

export default class DashboardSection extends Component {

    constructor(props) {
        super(props)
        this._clickStatusBox = this._clickStatusBox.bind(this);
        this.state = {
            CPUData: [],
            detail: {},
            firstAnimEnd: false,
            isCPULoaded: false,
            isTransectionLoaded: false,
            isActiveUserLoaded: false,
            status: 0
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
        var baseList = []
        var result = []
        var date = new Date();
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        for (const i of Array(7).fill(0).map((_, i) => 6-i)) {
            baseList.push(date.valueOf()/1000-3600*i)
        }

        baseList.map((base) => {
            var temp = {}
            var dTemp = new Date(base*1000)
            temp['time'] = dTemp.getHours()+':00'
            temp['hit'] = [0,0,0,0,0,0,0,0,0,0,0,0]
            temp['base'] = base
            result.push(temp)
        })
        result.map((item) => {
            for (const key of Object.keys(_data)) {
                var d = new Date(Number.parseInt(key)*1000);
                if(item['base'] == key) {
                    var index = Number.parseInt(d.getMinutes())/5
                    item['hit'][index] = Math.ceil(_data[key]/20)
                    item['base'] = Number.parseInt(key)
                }
            }
        })
        return result;
    }

    async _clickStatusBox(_time) {
        var token = await AsyncStorage.getItem('token');
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 200) {
                var responseJSON = JSON.parse(request.responseText);
                this.setState({
                    detail: this._processDetail(responseJSON),
                    isActiveUserLoaded: true,
                    isTransectionLoaded: true
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+SUFFIX_CPU+'/'+'1465813200');
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    _processDetail(_data) {
        var result = {}
        // process active user
        var tempObj = {}
        var l = []
        tempObj['name'] = 'Active User Count'
        tempObj['primaryColor'] = '#2c5ae9'
        tempObj['secondaryColor'] = 'white'
        tempObj['values'] = []
        _data['user'].forEach((item) => {
            tempObj['values'].push(item['value'])
        })
        result['user'] = {}
        result['user']['graph'] = []
        result['user']['graph'].push(tempObj)

        tempObj = []
        _data['user'].forEach((item) => {
            tempObj.push(item['time'].match(/:[0-9]{2}:[0-9]{2}/)[0])
        })
        result['user']['categoryLabels'] = tempObj

        // process Transection
        tempObj = [
            { name: '200', primaryColor: '#4c80f1', secondaryColor: 'white', values: []},
            { name: '401', primaryColor: '#ffda00', secondaryColor: 'white', values: []},
            { name: '500', primaryColor: '#ff7595', secondaryColor: 'white', values: []}
        ]
        _data['transaction'].sort((a, b) => {
            if (a.mean > b.mean) { return -1; }
            if (a.mean < b.mean) { return  1; }
            else { return 0; }
        })
        _data['transaction'] = _data['transaction'].slice(0,5)
        _data['transaction'].forEach((item) => {
            l.push(item['path'])
            tempObj[0]['values'].push(0)
            tempObj[1]['values'].push(0)
            tempObj[2]['values'].push(0)
            _data['transactionStatus'].forEach((check) => {
                if(check['path'] == item['path']) {
                    if(check['status'] == '200') {
                        tempObj[0]['values'].pop()
                        tempObj[0]['values'].push(check['count'])
                    }
                    if(check['status'] == '401') {
                        tempObj[1]['values'].pop()
                        tempObj[1]['values'].push(check['count'])
                    }

                    if(check['status'] == '500') {
                        tempObj[2]['values'].pop()
                        tempObj[2]['values'].push(check['count'])
                    }
                }
            })
        })
        result['transaction'] = {}
        result['transaction']['data'] = tempObj
        result['transaction']['categoryLabels'] = l
        console.log(result);
        return result
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
        if(this.state.isCPULoaded && this.state.firstAnimEnd) {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" style={[gStyles.card, {paddingBottom: 20}]}>
                    <View style={{margin:10, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>System Status</Text>
                        <Text style={{marginLeft: 8, borderRadius: 2, borderColor: '#2c5ae9', borderWidth: 0.8, padding: 2, fontSize: 8, width: 35, textAlign: 'center', color: '#2c5ae9'}}>CPU</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out">
                        <HeatmapChart
                            colorStream={['#E1E4E6', '#87b1f3', '#6b9df3', '#5188f2', '#3b72ef', '#2c5ae9']}
                            dataSet={this.state.CPUData}
                            onClickStatus={this._clickStatusBox}
                            />
                    </Animatable.View>
                </Animatable.View>
            );
        }else {
            return(
                <Animatable.View animation="fadeInDown" easing="ease-out" onAnimationEnd={() => this.setState({firstAnimEnd: true})} style={gStyles.card}>
                    <View style={{margin:10, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>System Status</Text>
                        <Text style={{marginLeft: 8, borderRadius: 2, borderColor: '#2c5ae9', borderWidth: 0.8, padding: 2, fontSize: 8, width: 35, textAlign: 'center', color: '#2c5ae9'}}>CPU</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <View style={{flexDirection: 'column', alignItems: 'center', height: 250}}>
                        <View style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
                            <Spinner style={{margin: 30}} isVisible={true} size={50} type={'Wave'} color={'#4c80f1'}/>
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
        if(this.state.isActiveUserLoaded && this.state.firstAnimEnd) {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" style={gStyles.card}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Active User</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out">
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
                            categoryLabels={this.state.detail['user']['categoryLabels']}>
                            <LineChart
                                lineWidth={1}
                                pointBorderWidth={1}
                                pointRadius={2}
                                categoryAxisMode={'range'}
                                datasets={this.state.detail['user']['graph']}
                                valueScale={{min: 0, max: 13, unit: 1}}
                            />
                        </Axes>
                    </Animatable.View>
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
        if(this.state.isTransectionLoaded && this.state.firstAnimEnd) {
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
                    <Animatable.View animation="bounceIn" easing="ease-out">
                        <Axes
                            style={{height: 300, paddingRight: 10}}
                            showCategoryTicks={false}
                            showCategoryGridlines={false}
                            showValueGridlines={false}
                            valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                            categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                            valueLabelStyle={{color: '#a9afb3'}}
                            categoryLabelStyle={{color: '#a9afb3'}}
                            valueScale={{min: 0, max: 100, unit: 10}}
                            categoryLabels={this.state.detail['transaction']['categoryLabels']}
                            orientation='horizontal'>
                            <BarChart
                                style={{height: 300}}
                                spacing={1}
                                clusterSpacing={1}
                                barBorderWidth={1}
                                displayMode={'stacked'}
                                datasets={this.state.detail['transaction']['data']}
                                valueScale={{min: 0, max: 100, unit: 10}}
                            />
                        </Axes>
                    </Animatable.View>
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
