import { View, Text } from 'react-native'
import React from 'react'
import { Modal as RnModal ,ModalProps } from 'react-native'

export default function Modal({children,visible,onRequestClose,animationType,transparent,statusBarTranslucent}:ModalProps) {
  return (
    <RnModal visible={visible} onRequestClose={onRequestClose} animationType={animationType} transparent={transparent} statusBarTranslucent={statusBarTranslucent}>
      {children}
    </RnModal>
  )
}