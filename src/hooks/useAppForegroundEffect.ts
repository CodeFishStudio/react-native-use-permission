import {useEffect, useRef} from 'react';

import {AppState, AppStateStatus} from 'react-native';

type Callback = () => void;

/**
 * Runs an effect when the user has returned to the app after leaving.
 */
const useAppForegroundEffect = (callback: Callback) => {
    const savedCallback = useRef<Callback>(() => null);
    const previousAppState = useRef<AppStateStatus>(AppState.currentState);

    /**
     * Save the callback in a ref on any change so it can be called in
     * the other useEffect without being a dependency
     */
    useEffect(() => {
        savedCallback.current = callback;
    });

    /**
     * Setup a listener for the app state change
     */
    useEffect(() => {
        const onChange = (newState: AppStateStatus) => {
            if (
                newState === 'active' &&
                previousAppState.current !== 'active'
            ) {
                savedCallback.current();
            }

            previousAppState.current = newState;
        };

        const subscription = AppState.addEventListener('change', onChange);

        return () => {
            subscription.remove();
        };
    }, []);
};

export {useAppForegroundEffect};
