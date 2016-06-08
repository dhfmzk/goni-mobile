'use strict'

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
    TouchableOpacity
} from 'react-native'

export default class HeatmapChart extends Component {

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
                        {this._timeBarRender(this.props.dataSet[0])}
                        {this._timeBarRender(this.props.dataSet[1])}
                        {this._timeBarRender(this.props.dataSet[2])}
                        {this._timeBarRender(this.props.dataSet[3])}
                        {this._timeBarRender(this.props.dataSet[4])}
                        {this._timeBarRender(this.props.dataSet[5])}
                        {this._timeBarRender(this.props.dataSet[6])}
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
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+0)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][0]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+300)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][1]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+600)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][2]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+900)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][3]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+1200)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][4]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+1500)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][5]], margin: 1}}></TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+1800)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][6]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+2100)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][7]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+2400)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][8]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+2700)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][9]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+3000)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][10]], margin: 1}}></TouchableOpacity>
                        <TouchableOpacity onPressOut={() => this.props.onClickStatus(_data['base']+3300)} style={{borderRadius: 2, height: 15, width:15, backgroundColor: this.props.colorStream[_data['hit'][11]], margin: 1}}></TouchableOpacity>
                    </View>
                </View>
                <Text style={{color: '#4d5256', fontSize: 13}}>
                    {_data['time']}
                </Text>
            </View>
        );
    }
}

HeatmapChart.propTypes = {
    onClickStatus: React.PropTypes.func,
    dataSet: React.PropTypes.array,
    colorStream: React.PropTypes.array
}
