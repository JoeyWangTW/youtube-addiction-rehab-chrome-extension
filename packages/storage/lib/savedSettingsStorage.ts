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
    apiErrorStatus: {
        type: 'AUTH' | 'RATE_LIMIT' | null;
        timestamp: number | null;
    };
};

type SettingsStorage = BaseStorage<UserSettings>;

const defaultSettings: UserSettings = {
    openAIApiKey: '',
    anthropicApiKey: '',
    blockerEnabled: false,
    videoEvalEnabled: true,
    filterEnabled: false,
    hideShortsEnabled: false,
    llmModel: 'claude-3-haiku-20240307',
    aiProvider: 'anthropic',
    apiErrorStatus: {
        type: null,
        timestamp: null,
    },
};

const settingsStorage = createStorage<UserSettings>('user-settings-storage-key', defaultSettings, {
    storageType: StorageType.Local,
    liveUpdate: true,
});

export const savedSettingsStorage: SettingsStorage = settingsStorage;
