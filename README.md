# usePermission()

React Native hook to help manage the status of a desired permission
type.

Returns the current status of the permission and a callback to request
the access to the permission via system prompts.

## Installation

> ℹ️ This hook is written in uncompiled Typescript, so ensure your project
> supports reading Typescript files.

Updating the command below to use your
desired version:

```bash
npm i https://github.com/CodeFishStudio/react-native-use-permission#v1.0.2
```

### Install peer dependencies

```bash
npm i react-native-permissions react-native-device-info
```

## Setup

Follow the [setup
instructions](https://github.com/zoontek/react-native-permissions#setup)
for `react-native-permissions` to include the relevant system
permissions and usage descriptions
in your native `/ios` and `/android` files.

## Usage

Call the hook by providing the desired permission type:

```typescript
import {usePermission, PermissionType} from 'react-native-use-permission';

const permission = usePermission(PermissionType.BLUETOOTH);

const isFocused = useIsFocused(); // from React Navigation

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
| `PermissionType.CAMERA`        | Ability to access the device’s camera to take photos.         |
| `PermissionType.LOCATION`      | Ability to query the system for the user’s current location.  |
| `PermissionType.PHOTO_LIBRARY` | Ability to pick a photo from the user’s device photo library. |
| `PermissionType.WIFI`          | Ability to read the SSID of the devices WiFi network.         |

## API

The returned `permission` object contains the following items:

### `status`

The current status of the permission type (see table below).

Will initialise in the
`PermissionStatus.INITIALISING` state while the initial status check is
performed. After which will update to reflect the current
status.

`status` will also update on any re-foregrounding of the app (i.e. if
the user has gone to the app’s system settings and altered the app’s
current permissions).

| Permission Status               | Description                                                                                                                                                                                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PermissionStatus.INITIALISING` | The status has not been initialised yet and is unknown.                                                                                                                                                                                                    |
| `PermissionStatus.REQUESTABLE`  | The permission is requestable via the [`request()`](#request) callback.                                                                                                                                                                                    |
| `PermissionStatus.GRANTED`      | The permission has been granted and can be considered useable.                                                                                                                                                                                             |
| `PermissionStatus.BLOCKED`      | The permission has previously been requested, but denied by the user. In this situation the only way to enable the permission is to direct the user to the [app’s system settings page](#opensettings) for them to manually enable the desired permission. |

> ℹ️ **React Native Permissions** has a [helpful guide](https://github.com/zoontek/react-native-permissions#understanding-permission-flow) on how permission flows operate across iOS and Android

### `request()`

```typescript
request(): Promise<PermissionStatus>
```

Callback to request the system permission(s) for the permission type
provided to the `usePermission()` hook. This will present the user the
system dialog(s) for them to accept, deny or choose the level of
permission granted.

Will perform any action if [`status`](#status) ===
`PermissionStatus.REQUESTABLE` / [`isRequestable`](#isrequestable) is true.

Returns the updated [`status`](#status) value (or the current [`status`](#status) value if the
permission wasn’t requestable).

### `check()`

```typescript
check(): Promise<PermissionStatus>
```

Callback to explicitly recheck the permission status of the permission type provided to the
`usePermission()` hook. Will update the `status` value with the result
as well as returning it.

This callback is rarely needed as [`status`](#status) will self update on any
change to the app being re-foregrounded.

Returns the current [`status`](#status) value.

### `openSettings()`

```typescript
openSettings(): Promise<void>
```

Convenience callback that aliases React Native’s
[Linking.openSettings()](https://reactnative.dev/docs/linking#opensettings)
function.

Will open the Settings app and display the app’s custom settings, if any.

### `isInitialising`

Helper boolean representing if [`status`](#status) === `PermissionStatus.INITIALISING`

### `isGranted`

Helper boolean representing if [`status`](#status) === `PermissionStatus.GRANTED`

### `isRequestable`

Helper boolean representing if [`status`](#status) === `PermissionStatus.REQUESTABLE`

### `isBlocked`

Helper boolean representing if [`status`](#status) === `PermissionStatus.BLOCKED`

# Version History

Refer to the [change
log](https://github.com/CodeFishStudio/react-native-use-permission/blob/master/CHANGELOG.md)
for version history.
