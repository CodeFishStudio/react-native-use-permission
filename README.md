# usePermission()

React Native hook to help manager the status of a provided permission
type. Returning a helper function to request the permission if it is
requestable.

## Installation

This is hook is written in uncompiled Typescript, so ensure your project
supports reading Typescript files.

This hook requires `react-native-permissions` and
`react-native-device-info` to also be installed in the React Native project.

```
# Update below to use the desired version of this package:

npm i react-native-permissions react-native-device-info https://github.com/CodeFishStudio/react-native-use-permission#v1.0.0
```

## Setup

Follow the [setup
instructions](https://github.com/zoontek/react-native-permissions#setup)
for `react-native-permissions` to include the relevant permissions
required for your project.

## Usage

Call the hook by providing the `PermissionType` enum you would like to query:

```
const permission = usePermission(PermissionType.BLUETOOTH);

const isFocused = useIsFocused();

/**
 * Requests the Bluetooth permission when this screen comes into focus.
 */
useEffect(() => {
    if (isFocused && permission.isRequestable) {
        permission.request();
    }
}, [isFocused, permission]);

```

### Permission Types

Each permission type will request the relevant system permission(s)
required for the desired functionality:

| Permission Type                | Functionality                                                 |
| ------------------------------ | ------------------------------------------------------------- |
| `PermissionType.BLUETOOTH`     | Ability to use of the systems Bluetooth functionality.        |
| `PermissionType.LOCATION`      | Ability to query the system for the user's current location.  |
| `PermissionType.PHOTO_LIBRARY` | Ability to pick a photo from the user's device photo library. |
| `PermissionType.WIFI`          | Ability to read the SSID of the devices WiFi network.         |

## API

The returned `permission` object contains the following items:

### `status`

The current status of the permission type (see table below).

Will initialise in the
`PermissionStatus.INITIALISING` state while the initial status check is
performed. After which the value will update to reflect the current
status.

`status` will also update on any re-foregrounding of the app (i.e. if
the user has gone to the app's system settings and altered the app's
current permissions).

| Permission Status               | Description                                                                                                                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PermissionStatus.INITIALISING` | The status has not been initialised yet and is unknown.                                                                                                                                                                                   |
| `PermissionStatus.GRANTED`      | The permission has been granted and can be considered useable.                                                                                                                                                                            |
| `PermissionStatus.REQUESTABLE`  | The permission is requestable via the `request()` callback provided by `usePermission()` hook's return object.                                                                                                                            |
| `PermissionStatus.BLOCKED`      | The permission has previously been requested, but denied by the user. In this situation the only way to enable the permission is to direct the user to the app's system settings page for them to manually enable the desired permission. |

### `request()`

Callback to request the system permission(s) for the permission type
provided to the `usePermission()` hook. This will present the user the
system dialog(s) for them to accept, deny or choose the level of
permission granted.

Will only be request the permission(s) if [`status`](#status) ===
`PermissionStatus.REQUESTABLE` / [`isRequestable`](#isrequestable) is true.

Returns the updated [`status`](#status) value (or the current [`status`](#status) value if the
permission wasn't requestable).

### `check()`

Callback to explicitly recheck the permission status of the permission type provided to the
`usePermission()` hook.

This callback will be rarely needed as [`status`](#status) will self update on any
change to the app being re-foregrounded.

Returns the current [`status`](#status) value.

### `isInitialising`

Helper boolean representing if [`status`](#status) === `PermissionStatus.INITIALISING`

### `isGranted`

Helper boolean representing if [`status`](#status) === `PermissionStatus.GRANTED`

### `isRequestable`

Helper boolean representing if [`status`](#status) === `PermissionStatus.REQUESTABLE`

### `isBlocked`

Helper boolean representing if [`status`](#status) === `PermissionStatus.BLOCKED`
