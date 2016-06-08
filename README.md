# goni-mobile
for mobile push notification and simple chart

### We need react-native-cli
Install with the following command:
```bash
npm install -g react-native-cli
npm install -g rnpm
```

### iOS build
Until the library is modified, it is impossible to try to build.
```bash
npm install
rnpm link
react-native run-ios
```

###TODO
* StyleSheet refactoring and make global style
* Fix issue for frame drop by async and re-rendering
 * add loading animation then re-rendering with set.state and animatable
* Touch event handling on System Status
