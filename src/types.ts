import {MutableRefObject} from 'react';
import {Linking} from 'react-native';

export enum PermissionType {
    BLUETOOTH = 'bluetooth',
    CAMERA = 'camera',
    LOCATION = 'location',
    PHOTO_LIBRARY = 'photoLibrary',
    WIFI = 'wifi',
}

export enum PermissionStatus {
    /**
     * The status has not been initialised yet
     */
    INITIALISING = 'initialising',

    /**
     * The permission has been granted and can be considered useable
     */
    GRANTED = 'granted',

    /**
     * The permission is requestable via the `request()` callback provided
     * by `usePermission()` hook's return object.
     */
    REQUESTABLE = 'requestable',

    /**
     * The permission has previously been requested, but denied by the
     * user. In this situation the only way to enable the permission is
     * to direct the user to the app's settings page for them to manually
     * enable the desired permission.
     */
    BLOCKED = 'blocked',
}

export type PermissionRequestFunction = () => Promise<PermissionStatus>;
export type PermissionCheckFunction = () => Promise<PermissionStatus>;

export type UsePermissionHook = {
    (type: PermissionType): {
        /**
         * The current status of the permission. Will initiase in the
         * INITIALISING state while the initial check() is performed.
         */
        status: PermissionStatus;

        /**
         * The same value as `status` but contained within a ref so its
         * up-to-date value can be accessed within callbacks with a
         * stable reference.
         */
        statusRef: MutableRefObject<PermissionStatus>;

        /**
         * Callback to request permissions for the permission type
         * provided to the usePermission hook.
         */
        request: PermissionRequestFunction;

        /**
         * Callback to force a re-check of the current status of
         * permissions for the permission type provided to the
         * usePermission hook.
         */
        check: PermissionCheckFunction;

        /**
         * Alias for React Native's Linking.openSettings(). Open the Settings
         * app and displays the app’s custom settings, if it has any.
         */
        openSettings: (typeof Linking)['openSettings'];

        isInitialising: boolean;
        isGranted: boolean;
        isRequestable: boolean;
        isBlocked: boolean;
    };
};
