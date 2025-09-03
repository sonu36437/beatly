import { View, Text, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { Modal as RnModal ,ModalProps } from 'react-native'

export default function Modal({children,visible,onRequestClose,animationType,transparent=true,statusBarTranslucent}:ModalProps) {

  return (
    
    <RnModal visible={visible} onRequestClose={onRequestClose} animationType={animationType} transparent={transparent} statusBarTranslucent={statusBarTranslucent} style={{margin:0,flex:1}}>
      <StatusBar hidden={true}/>
  
      {children}
    </RnModal>
  )
}

