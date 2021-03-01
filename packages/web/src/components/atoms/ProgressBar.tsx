import React from 'react';
import {View, Text} from 'react-native';

const ProgressBar = (props:any) => {
    const { bgcolor, completed } = props;
  
    const containerStyles = {
      height: 20,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      margin: 50
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: bgcolor,
    //   borderRadius: 'inherit',
      textAlign: 'right'
    }
  
    const labelStyles = {
      padding: 5,
      color: 'white',
    //   fontWeight: 'bold'
    }
  
    return (
      <View style={containerStyles}>
        <View style={fillerStyles}>
          <Text style={labelStyles}>{`${completed}%`}</Text>
        </View>
      </View>
    );
  };
  
  export default ProgressBar;