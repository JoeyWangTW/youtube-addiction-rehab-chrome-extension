import { BaseStorage, createStorage, StorageType } from './base';

type UserSettings = {
    openAIApiKey: string;
    blockerEnabled: boolean;
    videoEvalEnabled: boolean;
};

type SettingsStorage = BaseStorage<UserSettings>;

const defaultSettings: UserSettings = { openAIApiKey: '', blockerEnabled: false, videoEvalEnabled: true };

const settingsStorage = createStorage<UserSettings>('user-settings-storage-key', defaultSettings, {
    storageType: StorageType.Local,
    liveUpdate: true,
});

export const savedSettingsStorage: SettingsStorage = settingsStorage;
