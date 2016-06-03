'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {
    Axes,
    BarChart,
    LineChart,
    makeRange,
    generateScale
} from 'react-native-vs-charts'
import HitmapChart from '../components/HitmapChart'
import FullBarChart from '../components/FullBarChart'

const GONIPLUS_ROOT_URI = 'https://dashboard.goniapm.io/api/goniplus/'
const SUFFIX_CPU = '/overview/dashboard/cpu'


var testData1 = [
    {name: 'test1', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [10, 4, 6, 7, 8,12,18,23,11,12, 9]}
]
var testData2 = [
    {name: 'test1', primaryColor: '#7cd06b', secondaryColor: 'white', values: [68,73,71,62,89]},
    {name: 'test2', primaryColor: '#ffda00', secondaryColor: 'white', values: [20,13,24,15, 6]},
    {name: 'test3', primaryColor: '#ff7595', secondaryColor: 'white', values: [12,14, 5,23, 5]}
]
var testData3 = [
    {name: 'test1', primaryColor: '#2c5ae9', secondaryColor: 'white', values: [10, 4, 6, 7, 8,12,18,23,11,12, 9]},
    {name: 'test2', primaryColor: '#4c80f1', secondaryColor: 'white', values: [10, 8, 7, 5, 7, 9,10, 3, 4, 5,16]},
    {name: 'test3', primaryColor: '#87b1f3', secondaryColor: 'white', values: [10,18,17,18,15, 9, 2, 4,15,13, 5]}
]

export default class DashboardSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            CPUData: ''
        };
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
                    CPUData: responseJSON
                })
            } else {
                console.warn('error');
            }
        };
        request.open('GET', GONIPLUS_ROOT_URI+this.props.projectKey+SUFFIX_CPU);
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send();
    }

    render() {
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>

                <View style={styles.settingCard}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>CPU Hitmap</Text>
                    </View>
                    <View style={{height:1, backgroundColor: 'gray', margin: 15, marginLeft: 20, marginRight: 20}}></View>
                    <HitmapChart
                        colorStream={['#E1E4E6', '#87b1f3', '#6b9df3', '#5188f2', '#3b72ef', '#2c5ae9']}
                        dataSet={this.state.CPUData}/>
                </View>
                <View style={styles.settingCard}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Active User</Text>
                    </View>
                    <View style={{height:1, backgroundColor: 'gray', margin: 15, marginLeft: 20, marginRight: 20}}></View>
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
                </View>
                <View style={styles.settingCard}>
                    <View style={{margin:10}}>
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Top 5 Transection</Text>
                    </View>
                    <View style={{height:1, backgroundColor: 'gray', margin: 15, marginLeft: 20, marginRight: 20}}></View>
                    <View>
                        <View>
                        </View>
                    </View>
                    <FullBarChart dataSet={[80,10,10]} barLabel={'api/asdfg/tester'}/>
                    <FullBarChart dataSet={[75,11,14]} barLabel={'api/asdfg/tester2'}/>
                    <FullBarChart dataSet={[78,13, 9]} barLabel={'api/asdfg/tester4'}/>
                    <FullBarChart dataSet={[74,12,14]} barLabel={'api/asdfg/tester3'}/>
                    <FullBarChart dataSet={[74,12,14]} barLabel={'api/asdfg/tester12'}/>
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
        shadowRadius: 3,
        paddingBottom: 20,
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
