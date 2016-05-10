'use strict';

// import React elements
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    NavigatorIOS
} from 'react-native';

// import RNChart from 'react-native-chart';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    chart: {
        position: 'absolute',
        top: 16,
        left: 4,
        bottom: 4,
        right: 16,
    }
});
export default class GoniDashboard extends Component {

    // constructor -> sett state
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.token,
            user: this.props.user
        };
    }

    render() {
        return (
            <View style={{marginTop: 20}}>
                <View>
                    <Text style={{textAlign: 'center'}}>Goni Dashboard</Text>
                </View>
            </View>
        );
    }
}

const chartData = [
    {
        name: 'BarChart',
        type: 'bar',
        color:'purple',
        widthPercent: 0.6,
        data: [43, 41, 21, 12, 53, 245, 21, 116, 12, 234, 535, 36],
    },
    {
        name: 'LineChart',
        color: 'gray',
        lineWidth: 2,
        highlightIndices: [1, 2],
        highlightColor: 'blue',
        showDataPoint: true,
        data: [35, 43, 24, 25, 65, 87, 89, 66, 45, 16, 84, 12],
    }
];
const xLabels = ['0','1','2','3','4','5','6','7','8','9','10','11'];
