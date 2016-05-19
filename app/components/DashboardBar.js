import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';

export default class FacebookTabBar extends Component {
  tabIcons: []

  componentDidMount() {
    this.setAnimationValue({ value: this.props.activeTab, });
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  }

  setAnimationValue({ value, }) {

  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    const tabWidth = this.props.containerWidth / this.props.tabs.length;
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ], outputRange: [0, tabWidth, ],
    });

    return <View>
      <View style={[styles.tabs, this.props.style, ]}>
        {this.props.tabs.map((tab, i) => {
          return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
            <Text>
                dafdfa
            </Text>
          </TouchableOpacity>;
        })}
      </View>
      <Animated.View style={[styles.tabUnderlineStyle, { width: tabWidth }, { left, }, ]} />
    </View>;
  }
}

FacebookTabBar.propTypes = {
      goToPage: React.PropTypes.func.isRequired,
      activeTab: React.PropTypes.number.isRequired,
      tabs: React.PropTypes.array.isRequired,
}
FacebookTabBar.defaultProps = {
      activeTab: 0,
      tabs: []
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabUnderlineStyle: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#3b5998',
    bottom: 0,
  },
});

export default FacebookTabBar;
