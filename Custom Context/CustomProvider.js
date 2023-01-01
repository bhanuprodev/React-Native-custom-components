
import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    View,
} from 'react-native';
import GlobalAlertByProvider from './GlobalAlertByProvider';
import GlobalLoaderByProvider from './GlobalLoaderByProvider';
import NetInfo from "@react-native-community/netinfo";
import { requestGet } from '../network/RestAPIClient';
import { NetWorkServiceUrls } from '../network/NetWorkServiceUrls';
import { getStoragePrefObjectValue, handleResponse } from './Exports';
export const AlertContext = React.createContext({});
export const AlertConsumer = AlertContext.Consumer;
export const AlertProvider = (props) => {
    const internet = useRef(false)
    const globalConstants = useRef({})
    const responsiveHeight = useRef(0)
    const modalRef = useRef(null)
    const isEntered = useRef(false)
    const alertRef = useRef(null)
    const isInBusy = useRef(false)
    const getResponsiveHeight = () => {
        return responsiveHeight.current
    }
    const getGlobalConstants = () => {
        return globalConstants.current;
    }
    const setGlobalConstants = (data) => {
        globalConstants.current = data;
    }
    const setProps = (value) => {
        if (modalRef && modalRef.current && modalRef.current.setProps) {
            modalRef.current.setProps(value)
        }
    }
    const loaderstate = (visible = false, obj) => {
        if (modalRef && modalRef.current && modalRef.current.loaderRefresh) {
            modalRef.current.loaderRefresh(visible, obj)
        }
    }
    const alertState = (visible = false, cancellable = false, value = "") => {
        if (alertRef && alertRef.current && alertRef.current.alertConfig) {
            alertRef.current.alertConfig(visible, cancellable, value)
        }
    }
    const getGlobalConstantsFunction = () => {
        isInBusy.current = true
        requestGet(props, NetWorkServiceUrls.globalConstants).then((res) => {
            isInBusy.current = false
            try {
                if (res && res.data && (res.data.status == "200" || res.data.status == "success") && res.data.data) {
                    isEntered.current = true
                    globalConstants.current = res.data.data
                    console.warn("set", res.data.data)
                }
                else {
                    console.error(res)
                }
            }
            catch (e) {
                console.error(e)
            }
        })
    }
    // const unsubscribe = NetInfo.addEventListener(state => {
    //     let a = state.isConnected;
    //     let b = !isEntered.current;
    //     let c = !isInBusy.current
    //     if (a && b && c) {
    //         getGlobalConstantsFunction()
    //     }
    // });
    useEffect(() => {

        getStoragePrefObjectValue('globalConstants').then((val) => {
            globalConstants.current = val
        })
        return () => {
            //  unsubscribe();
        }
    }, [])



    return (
        <View style={{ flex: 1 }} onLayout={(e) => {
            responsiveHeight.current = e.nativeEvent.layout.height
        }}>
            <AlertContext.Provider value={{
                responsiveHeight: getResponsiveHeight,
                loaderstate: loaderstate,
                alertState: alertState,
                setProps: setProps,
                getGlobalConstants: getGlobalConstants,
                setGlobalConstants: setGlobalConstants
            }}>
                {props.children}
            </AlertContext.Provider>
            <GlobalLoaderByProvider ref={modalRef}> </GlobalLoaderByProvider>
            <GlobalAlertByProvider ref={alertRef} > </GlobalAlertByProvider>
        </View>
    );
}
export const withGlobalContext = ChildComponent => props => (
    <AlertContext.Consumer>
        {
            context => <ChildComponent   {...props}
                responsiveHeight={context.responsiveHeight}
                internet={context.internet}
                loader={context.loaderstate}
                alert={context.alertState}
                getGlobalConstants={context.getGlobalConstants}
                setGlobalConstants={context.setGlobalConstants}
                setProps={context.setProps} />
        }
    </AlertContext.Consumer>
);
