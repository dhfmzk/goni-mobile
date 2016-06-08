'use strict'

import React from 'react';
import {
  StyleSheet,
} from 'react-native';

var gStyles = StyleSheet.create({
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        padding: 5,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3
    },
    decoBar: {
        height:0.5,
        backgroundColor: 'gray',
        margin: 15,
        marginLeft: 20,
        marginRight: 20
    }
});

module.exports = gStyles;
