'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
} from 'react-native'

var hitTestData = [
    {time: '12: 00', hit:[1, 1, 1, 1, 1, 3, 1, 1, 1, 2, 3, 4]},
    {time: '13: 00', hit:[1, 1, 1, 3, 1, 2, 3, 1, 1, 2, 1, 1]},
    {time: '14: 00', hit:[1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 3, 3]},
    {time: '15: 00', hit:[3, 1, 1, 1, 4, 4, 2, 1, 1, 2, 4, 4]},
    {time: '16: 00', hit:[2, 1, 4, 5, 3, 5, 3, 1, 1, 2, 2, 1]},
    {time: '17: 00', hit:[4, 3, 2, 1, 1, 1, 4, 1, 2, 2, 3, 2]},
    {time: '18: 00', hit:[2, 1, 1, 1, 1, 1, 1, 1, 4, 2, 0, 0]}
]

export default class HitmapChart extends Component {

    constructor (props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {this._timeBarRender(hitTestData[0])}
                        {this._timeBarRender(hitTestData[1])}
                        {this._timeBarRender(hitTestData[2])}
                        {this._timeBarRender(hitTestData[3])}
                        {this._timeBarRender(hitTestData[4])}
                        {this._timeBarRender(hitTestData[5])}
                        {this._timeBarRender(hitTestData[6])}
                    </View>
                </View>
                <View style={{flex:1, alignItems: 'flex-start', marginTop: 20, marginLeft: 20}}>
                    <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                        <Text style={{fontSize: 13, color: '#4d5256'}}>color stream</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{borderRadius: 2, height: 10, width:10, backgroundColor: this.props.colorStream[0], margin: 1}}></View>
                            <View style={{borderRadius: 2, height: 10, width:10, backgroundColor: this.props.colorStream[1], margin: 1}}></View>
                            <View style={{borderRadius: 2, height: 10, width:10, backgroundColor: this.props.colorStream[2], margin: 1}}></View>
                            <View style={{borderRadius: 2, height: 10, width:10, backgroundColor: this.props.colorStream[3], margin: 1}}></View>
                            <View style={{borderRadius: 2, height: 10, width:10, backgroundColor: this.props.colorStream[4], margin: 1}}></View>
                            <View style={{borderRadius: 2, height: 10, width:10, backgroundColor: this.props.colorStream[5], margin: 1}}></View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _timeBarRender(_data) {
        return (
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', margin: 4}}>
                    <View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][0]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][1]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][2]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][3]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][4]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][5]], margin: 1}}></View>
                    </View>
                    <View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][6]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][7]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][8]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][9]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][10]], margin: 1}}></View>
                        <View style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][11]], margin: 1}}></View>
                    </View>
                </View>
                <Text style={{color: '#4d5256', fontSize: 13}}>
                    {_data['time']}
                </Text>
            </View>
        );
    }
}

HitmapChart.propTypes = {
    dataSet: React.PropTypes.string,
    colorStream: React.PropTypes.array
}
