'use strict'

import React, { Component } from 'react'
import {
    View,
    Text
} from 'react-native'

export default class FullBarChart extends Component {

    constructor (props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', margin: 10, marginRight: 20}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 80, flexDirection: 'column', paddingRight: 10, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end', flex: 1}}>
                            <Text style={{fontSize: 12, width: 70}}>{this.props.barLabel}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: '#4c80f1', height: 40, flex: this.props.dataSet[0]}}>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{fontSize: 8, color: 'white'}}>{this.props.dataSet[0]}%</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffda00', height: 40, flex: this.props.dataSet[1]}}>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{fontSize: 8, color: 'white'}}>{this.props.dataSet[1]}%</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: '#ff7595', height: 40, flex: this.props.dataSet[2]}}>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{fontSize: 8, color: 'white'}}>{this.props.dataSet[2]}%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

FullBarChart.propTypes = {
    barLabel: React.PropTypes.string,
    dataSet: React.PropTypes.array
}
