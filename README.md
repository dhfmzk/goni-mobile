# goni-mobile
### Mobile simple chart application for goni

![goni-mobile](./readmeResource/goniLogin.png)  


## Goni mobile Overview  

Dashboard | API Transaction | Metrics | Setting
----------|-----------------|---------|--------
![goni-mobile-dashboard](./readmeResource/goniDashboardd.gif) | ![goni-mobile-api](./readmeResource/goniApiSection.gif) | ![goni-mobile-metrics](./readmeResource/goniMetricsSection.gif) | ![goni-mobile-setting](./readmeResource/goniSetting.png)

#### 1. Goni Dashboard Section  
* By clicking system status heatmap, which is drawn by instance's CPU status
you can check Active User and Top 5 Transaction 

#### 2. Goni API Transaction Section  
* You can check API Transaction (min, mean, max time and panic count)
* And check Response Time dot graph

#### 3. Goni Metrics Section(Warning)
* You can check Expvar Metric (Runtime Metric not yet)
* In this section, we draw a graph of the number of the number at a time. We know degradation of performance and have a solution. This issue be fixed in the next minor version. Please do not use if possible.

#### 4. Goni Setting Section  
* You can check slack notifiaction setting and your project members
* If you want to logout, check this section


### We need react-native-cli
Install with the following command:
```bash
npm install -g react-native-cli
npm install -g rnpm
```

### iOS build
Until the library is modified, it is impossible to try to build.  
But if you want to build it, fix 'react-native-vs-chart' bug [here](https://github.com/bretdabaker/react-native-vs-charts/pull/3).  
may be it will work :D
```bash
npm install
rnpm link
react-native run-ios
```

### TODO
* StyleSheet refactoring and make global style
* Fix issue for Metric section
  * just one graph rendering and user chose typeof metric
* Make therd part lib for chart
  * 'react-native-vs-chart' is not updated. so, I will make new lib for chart (Use only the view style sheet)
  * And add 'heatmap chart' in system status, 'pie chart' in runtime section etc..
  
### License
<img align="right" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png">
The MIT License (MIT)

Copyright (c) 2016 goniapm

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
