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
                this._processDetail(responseJSON)
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+SUFFIX_CPU+'/'+_time.toString());
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    _processDetail(_data) {
        console.log(_data);
        if(!_data) { return null }
        var result = {}
        // process active user
        var tempObj = {}
        var a = {}
        var l = []
        var max = []
        var checkT = false;
        var checkU = false;
        if(_data['user']) {
            if(_data['user'].length > 0) {
                // if(_data['user'] == 'undefined') { return null }
                checkU = true
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
                    max.push(item['value'])
                })
                for (const i of Array(15).fill(0).map((_, i) => i)) {
                    if(i % 4 !== 0) {
                        tempObj[i] = ''
                    }else {
                        tempObj[i] = tempObj[i].substr(1,5)
                    }
                }
                result['user']['categoryLabels'] = tempObj
                result['user']['scale'] = { min: 0, max: Math.max(...max)>0? Math.max(...max) : 10, unit: Math.ceil(Math.max(...max)/10)>0? Math.ceil(Math.max(...max)/10) : 1 }
            }
        }
        // process Transection
        if(_data.length > 0) {
            checkT = true
            tempObj = [
                { name: '200', primaryColor: '#4c80f1', secondaryColor: 'white', values: []},
                { name: '401', primaryColor: '#ffda00', secondaryColor: 'white', values: []},
                { name: '500', primaryColor: '#ff7595', secondaryColor: 'white', values: []}
            ]
            max = []
            _data['transaction'].sort((a, b) => {
                if (a.mean > b.mean) { return -1; }
                if (a.mean < b.mean) { return  1; }
                else { return 0; }
            })
            _data['transaction'] = _data['transaction'].slice(0,5)
            _data['transaction'].forEach((item) => {
                max.push(item['count'])
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
            result['transaction']['scale'] = { min: 0, max: Math.max(...max)>0? Math.max(...max) : 10, unit: Math.ceil(Math.max(...max)/10)>0? Math.ceil(Math.max(...max)/10) : 1 }
        }
        console.log(result);
        this.setState({
            detail: result,
            isActiveUserLoaded: checkU,
            isTransectionLoaded: checkT
        })
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
                <Animatable.View animation="fadeInDown" easing="ease-out" style={[gStyles.card, {paddingBottom: 20, height: 300}]}>
                    <View style={{margin:10, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>System Status</Text>
                        <Text style={{marginLeft: 8, borderRadius: 2, borderColor: '#2c5ae9', borderWidth: 0.8, padding: 2, fontSize: 8, width: 35, textAlign: 'center', color: '#2c5ae9'}}>CPU</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <Animatable.View animation="bounceIn" easing="ease-out" style={{marginTop: 15}}>
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
                <Animatable.View animation="fadeInDown" easing="ease-out" style={[gStyles.card, {paddingBottom: 20, height: 300}]}>
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
                <Animatable.View animation="fadeInDown" easing="ease-out" style={[gStyles.card, {height: 250}]}>
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
                            valueScale={this.state.detail['user']['scale']}
                            categoryLabels={this.state.detail['user']['categoryLabels']}>
                            <LineChart
                                lineWidth={1}
                                pointBorderWidth={1}
                                pointRadius={2}
                                categoryAxisMode={'range'}
                                datasets={this.state.detail['user']['graph']}
                                valueScale={this.state.detail['user']['scale']}
                            />
                        </Axes>
                    </Animatable.View>
                </Animatable.View>
            );
        }else {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" delay={300} style={[gStyles.card, {height: 250}]}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Active User</Text>
                    </View>
                    <View style={gStyles.decoBar}></View>
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
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
                    <Animatable.View animation="bounceIn" easing="ease-out" style={{flex: 1, height: 50}}>
                        <View style={{flexDirection: 'column', alignItems: 'center', height: 30}}>
                            <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{marginLeft: 5, marginRight: 5, flexDirection: 'row'}}>
                                    <Text style={{color: '#a9afb3', fontSize: 10}}>200</Text>
                                    <View style={{marginLeft: 5, marginRight: 5, width:30, backgroundColor: '#4c80f1', borderRadius: 2}}></View>
                                </View>
                                <View style={{marginLeft: 5, marginRight: 5, flexDirection: 'row'}}>
                                    <Text style={{color: '#a9afb3', fontSize: 10}}>401</Text>
                                    <View style={{marginLeft: 5, marginRight: 5, width:30, backgroundColor: '#ffda00', borderRadius: 2}}></View>
                                </View>
                                <View style={{marginLeft: 5, marginRight: 5, flexDirection: 'row'}}>
                                    <Text style={{color: '#a9afb3', fontSize: 10}}>500</Text>
                                    <View style={{marginLeft: 5, marginRight: 5, width:30, backgroundColor: '#ff7595', borderRadius: 2}}></View>
                                </View>
                            </View>
                        </View>
                    </Animatable.View>
                    <Animatable.View animation="bounceIn" easing="ease-out">
                        <Axes
                            style={{height: 200, paddingRight: 10}}
                            showCategoryTicks={false}
                            showCategoryGridlines={false}
                            showValueGridlines={false}
                            valueAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#a9afb3'}}
                            categoryAxisStyle={{axisLineWidth: 1, axisLineColor: '#a9afb3', gridlineColor: '#ced3d6'}}
                            valueLabelStyle={{color: '#a9afb3'}}
                            categoryLabelStyle={{color: '#a9afb3', fontSize: 8}}
                            valueScale={this.state.detail['transaction']['scale']}
                            categoryLabels={this.state.detail['transaction']['categoryLabels']}
                            orientation='horizontal'>
                            <BarChart
                                style={{height: 200}}
                                spacing={1}
                                clusterSpacing={1}
                                barBorderWidth={1}
                                displayMode={'stacked'}
                                datasets={this.state.detail['transaction']['data']}
                                valueScale={this.state.detail['transaction']['scale']}
                            />
                        </Axes>
                    </Animatable.View>
                </Animatable.View>
            );
        }else {
            return (
                <Animatable.View animation="fadeInDown" easing="ease-out" onAnimationEnd={() => this.setState({firstAnimEnd: true})} delay={600} style={gStyles.card}>
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
