import {useCallback, useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {
    checkMultiple,
    requestMultiple,
    PERMISSIONS,
} from 'react-native-permissions';
import {
    PermissionType,
    UsePermissionHook,
    PermissionStatus,
    PermissionRequestFunction,
    PermissionCheckFunction,
} from './types';
import {getConsolidatedStatus} from './utils/getConsolidatedPermissionStatus';
import {getSystemPermissions} from './utils/getSystemPermissions';
import {useAppForegroundEffect} from './hooks/useAppForegroundEffect';

/**
 * Hook to that returns the current status of the provided
 * `permissionType`, and provides a `request` callback for triggering a
 * system permission prompt if the permission is requestably.
 */
export const usePermission: UsePermissionHook = (
    permissionType: PermissionType
) => {
    const [status, setStatus] = useState<PermissionStatus>(
        PermissionStatus.UNKNOWN
    );

    /**
     * Whether a request is currently in flight.
     */
    const isRequesting = useRef(false);

    /**
     * A ref copy of `status` to be used in callbacks and effects
     * without needing to be a dependency.
     */
    const statusRef = useRef(status);

    /**
     * Checks the status of the `permissionType`, updates `status` and
     * returns the updated `status`.
     */
    const check = useCallback<PermissionCheckFunction>(async () => {
        if (!permissionType) return PermissionStatus.UNKNOWN;

        /**
         * If currently waiting for a result from the `request`
         * function, bail out from permission checking. This is to
         * prevent a race condition on Android where calling the
         * `request` function sometimes fires a change in the app
         * foreground state, which in turn calls this `checkPermission`
         * function which will provide the wrong status (on Android) if
         * a permission has been previously rejected.
         */
        if (isRequesting.current) return statusRef.current;

        const systemPermissions = getSystemPermissions(permissionType);

        if (!systemPermissions.length) {
            setStatus(PermissionStatus.GRANTED);
            return PermissionStatus.GRANTED;
        }

        const results = await checkMultiple(systemPermissions);
        const updatedStatus = getConsolidatedStatus(Object.values(results));

        setStatus(updatedStatus);

        return updatedStatus;
    }, [permissionType]);

    /**
     * Will trigger a system dialog to request the permission type.
     */
    const request = useCallback<PermissionRequestFunction>(async () => {
        if (
            !permissionType ||
            statusRef.current !== PermissionStatus.REQUESTABLE
        ) {
            return statusRef.current;
        }

        isRequesting.current = true;

        let systemPermissions = getSystemPermissions(permissionType);

        /**
         * On iOS, if requesting LOCATION, override the requested system
         * permission to be LOCATION_ALWAYS, which will grant the usual
         * LOCATION_WHEN_IN_USE permission as well.
         *
         * https://github.com/zoontek/react-native-permissions#about-ios-location_always-permission
         */
        if (
            Platform.OS === 'ios' &&
            permissionType === PermissionType.LOCATION
        ) {
            systemPermissions = [PERMISSIONS.IOS.LOCATION_ALWAYS];
        }

        if (!systemPermissions.length) {
            setStatus(PermissionStatus.GRANTED);
            return PermissionStatus.GRANTED;
        }

        const results = await requestMultiple(systemPermissions);
        const updatedStatus = getConsolidatedStatus(Object.values(results));

        setStatus(updatedStatus);

        isRequesting.current = false;

        return updatedStatus;
    }, [permissionType]);

    /**
     * Maintain the `savedStatus` value
     */
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    /**
     * Initialise the permission status
     */
    useEffect(() => {
        check();
    }, [check]);

    /**
     * Recheck the permission status on any change to the app's
     * foreground state
     */
    useAppForegroundEffect(check);

    return {
        status,
        request,
        check,

        isLoading: status === PermissionStatus.UNKNOWN,
        isGranted: status === PermissionStatus.GRANTED,
        isRequestable: status === PermissionStatus.REQUESTABLE,
        isBlocked: status === PermissionStatus.BLOCKED,
    };
};
