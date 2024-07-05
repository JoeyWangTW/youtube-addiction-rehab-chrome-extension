import { BaseStorage, createStorage, StorageType } from './base';

type UserSettings = {
    openAIApiKey: string;
    anthropicApiKey: string;
    blockerEnabled: boolean;
    videoEvalEnabled: boolean;
    filterEnabled: boolean;
    hideShortsEnabled: boolean;
    llmModel: string;
    aiProvider: 'openai' | 'anthropic';
};

type SettingsStorage = BaseStorage<UserSettings>;

const defaultSettings: UserSettings = {
    openAIApiKey: '',
    anthropicApiKey: '',
    blockerEnabled: false,
    videoEvalEnabled: true,
    filterEnabled: false,
    hideShortsEnabled: false,
    llmModel: 'gpt-3.5-turbo',
    aiProvider: 'openai',
};

const settingsStorage = createStorage<UserSettings>('user-settings-storage-key', defaultSettings, {
    storageType: StorageType.Local,
    liveUpdate: true,
});

export const savedSettingsStorage: SettingsStorage = settingsStorage;
