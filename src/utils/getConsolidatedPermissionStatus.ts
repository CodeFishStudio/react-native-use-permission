import {
    PermissionStatus as RNPermissionsStatus,
    RESULTS,
} from 'react-native-permissions';
import {PermissionStatus} from '../types';

/**
 * Returns a singular permission status value that is representative of
 * the status of an array of results from react-native-permissions
 * requestMultiple().
 *
 * The returned status will be GRANTED if all items are granted,
 * REQUESTABLE if some items are requestable but none are considered
 * blocked, otherwise will be BLOCKED.
 */
export const getConsolidatedStatus = (results: RNPermissionsStatus[]) => {
    let output: PermissionStatus | null = null;

    /**
     * If there are no permission results being passed, assume the
     * permission status is granted
     */
    if (!results.length) {
        return PermissionStatus.GRANTED;
    }

    results.forEach(result => {
        switch (result) {
            /**
             * BLOCKED: The permission is denied and not requestable anymore
             * UNAVAILABLE: This feature is not available (on this device/context)
             *
             */
            case RESULTS.BLOCKED:
            case RESULTS.UNAVAILABLE: {
                output = PermissionStatus.BLOCKED;
                break;
            }

            /**
             * DENIED: The permission has not been requested or is
             * denied but requestable
             */
            case RESULTS.DENIED: {
                output = PermissionStatus.REQUESTABLE;
                break;
            }

            /**
             * GRANTED: The permission is granted
             * LIMITED: The permission is granted but with limitations
             */
            case RESULTS.GRANTED:
            case RESULTS.LIMITED: {
                if (!output) {
                    output = PermissionStatus.GRANTED;
                }
                break;
            }

            default:
                break;
        }
    });

    /**
     * Fallback to BLOCKED if no status can be established
     */
    if (output === null) {
        return PermissionStatus.BLOCKED;
    }

    return output as PermissionStatus;
};
