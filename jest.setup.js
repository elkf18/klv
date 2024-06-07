/**
 * @format
 */

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-code-push', () => {
    const cp = (_) => (app) => app;
    Object.assign(cp, {
      InstallMode: {},
      CheckFrequency: {},
      SyncStatus: {},
      UpdateState: {},
      DeploymentStatus: {},
      DEFAULT_UPDATE_DIALOG: {},
  
      checkForUpdate: jest.fn(),
      codePushify: jest.fn(),
      getConfiguration: jest.fn(),
      getCurrentPackage: jest.fn(),
      getUpdateMetadata: jest.fn(),
      log: jest.fn(),
      notifyAppReady: jest.fn(),
      notifyApplicationReady: jest.fn(),
      sync: jest.fn(),
    });
    return cp;
  });
  jest.mock('react-native-bluetooth-escpos-printer', () => {
    const cp = (_) => (app) => app;
    Object.assign(cp, {
        DIRECTION: {},
    });
    return cp;
  });
