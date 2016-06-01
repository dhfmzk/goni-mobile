'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import {
    Axes,
    BarChart,
    LineChart,
    makeRange,
    generateScale
} from 'react-native-vs-charts'

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
        };
    }

    render() {
        return (
            <ScrollView style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8fafb'}}>
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
                        <Text style={{fontSize: 22, color: '#4d5256'}}>Top 5 Transactions</Text>
                    </View>
                    <View style={{height:1, backgroundColor: 'gray', margin: 15, marginLeft: 20, marginRight: 20}}></View>
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
                        categoryLabels={['api1', 'api6', 'api4', 'api2', 'api3']}
                        orientation='horizontal'>
                        <BarChart
                            style={{height: 300}}
                            spacing={1}
                            clusterSpacing={1}
                            barBorderWidth={1}
                            displayMode={'stacked'}
                            datasets={testData2}
                            valueScale={{min: 0, max: 100, unit: 10}}
                        />
                    </Axes>
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
