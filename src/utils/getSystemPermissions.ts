import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Permission, PERMISSIONS} from 'react-native-permissions';

import {PermissionType} from '../types';

type PermissionGroups = Record<
    PermissionType,
    {ios: Permission[]; android: Permission[]}
>;

const IS_EMULATOR = DeviceInfo.isEmulatorSync();
const ANDROID_API_LEVEL = Number(Platform.Version);

/**
 * Systems permissions required for the different PermissionTypes
 */
const permissionGroups: PermissionGroups = {
    [PermissionType.BLUETOOTH]: {
        /**
         * If using the iOS Simulator, automatically grant bluetooth
         * permission as it is not an available feature.
         */
        ios: IS_EMULATOR ? [] : [PERMISSIONS.IOS.BLUETOOTH],

        /**
         * Permissions required for Android change based on API level
         *
         * https://developer.android.com/guide/topics/connectivity/bluetooth/permissions#declare-android12-or-higher
         */
        android:
            ANDROID_API_LEVEL >= 31
                ? [
                      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                  ]
                : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    },

    [PermissionType.CAMERA]: {
        ios: [PERMISSIONS.IOS.CAMERA],
        android: [PERMISSIONS.ANDROID.CAMERA],
    },

    [PermissionType.LOCATION]: {
        ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
        android: [
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ],
    },

    [PermissionType.PHOTO_LIBRARY]: {
        ios: [PERMISSIONS.IOS.PHOTO_LIBRARY],

        /**
         * Permissions required for Android change based on API level
         *
         * https://developer.android.com/about/versions/14/changes/partial-photo-video-access#permissions
         */
        android:
            ANDROID_API_LEVEL >= 33
                ? ANDROID_API_LEVEL >= 34
                    ? [
                          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                          PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED,
                      ]
                    : [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES]
                : [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
    },

    [PermissionType.WIFI]: {
        ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
        android: [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    },
};

/**
 * Returns the system permissions required for the provided `permissionType`.
 */
export const getSystemPermissions = (permissionType: PermissionType) => {
    const platformSet = permissionGroups[permissionType];

    return Platform.select({
        ios: platformSet.ios,
        android: platformSet.android,
        default: [],
    });
};
