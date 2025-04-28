import React, { useState } from 'react';
import { View } from 'react-native';
import WelcomeScreen from '@/app/welcome';       

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <WelcomeScreen/>
    </View>
  );
}
