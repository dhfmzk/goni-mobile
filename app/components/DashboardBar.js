import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class FacebookTabBar extends Component {

    componentDidMount() {
        this.setAnimationValue({ value: this.props.activeTab, });
    }

    setAnimationValue({ value, }) {}

    render() {
        const tabWidth = this.props.containerWidth / this.props.tabs.length;
        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1, ], outputRange: [0, tabWidth, ],
        });

        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#4c80f1', height: 50}}>
                    <TouchableOpacity
                        onPressOut={() => Actions.pop()}
                        >
                        <Image
                            style={{margin: 10, width: 20, height: 20, tintColor: 'white'}}
                            source={require('../assets/icon/left-arrow.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{color: 'white', fontSize: 18, padding: 8, fontWeight: 'bold'}}>
                        {this.props.tabs.map((tab, i) => {
                            if(i === this.props.activeTab) {
                                return 'Goni ' + tab;
                            }
                        })}
                    </Text>
                </View>
                <View style={[styles.tabs, this.props.style]}>
                    {this.props.tabs.map((tab, i) => {
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => this.props.goToPage(i)}
                                style={styles.tab}>
                                <Image
                                    style={{tintColor: '#a9afb3', width:25, height:25}}
                                    source={this.props.tabIcons[tab]}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <Animated.View style={[styles.tabUnderlineStyle, { width: tabWidth }, { left, }, ]} />
            </View>
        );
    }
}

FacebookTabBar.propTypes = {
      activeTab: React.PropTypes.number.isRequired,
      tabs: React.PropTypes.array.isRequired,
      tabIcons: React.PropTypes.object.isRequired
}
FacebookTabBar.defaultProps = {
      activeTab: 0,
      tabs: [],
      tabIcons: {
          api: require('../assets/icon/api.png'),
          dashboard: require('../assets/icon/dashboard.png'),
          setting: require('../assets/icon/setting.png'),
          metrics: require('../assets/icon/metrics.png')
      }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        paddingTop: 5,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        backgroundColor: '#e1e4e6',
    },
    tabUnderlineStyle: {
        position: 'absolute',
        height: 2,
        backgroundColor: '#2c5ae9',
        bottom: 0,
    }
});
