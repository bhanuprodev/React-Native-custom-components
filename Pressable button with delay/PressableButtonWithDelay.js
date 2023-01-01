import React, { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import ColorConstants from '../constants/ColorConstants';
import ValueConstants from '../constants/ValueConstants';

const PressableButtonWithDelay = ({ presshandler, style, children }) => {

    const actived = useRef(true);

    return (
        <TouchableOpacity
            style={style ? { ...style, maxWidth: 400, alignSelf: 'center' } :
                {
                    backgroundColor: ColorConstants.baseOrangeColor,
                    padding: 5, borderRadius: 5, width: '80%',
                    alignItems: 'center', justifyContent: 'center',
                    paddingVertical: 10, alignSelf: 'center',
                    maxWidth: 400
                }}
            onPress={() => {
                if (actived.current && presshandler) {
                    actived.current = false
                    presshandler()
                    setTimeout(() => {
                        actived.current = true
                    }, ValueConstants.DELAY_ONPRESS)
                }
            }}
        >
            {children}
        </TouchableOpacity>
    )
};
export default PressableButtonWithDelay;