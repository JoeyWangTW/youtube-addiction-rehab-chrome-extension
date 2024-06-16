import { BaseStorage, createStorage, StorageType } from './base';

type UserGoals = {
    helpful: string;
    harmful: string;
};

type GoalsStorage = BaseStorage<UserGoals>;

const defaultGoals: UserGoals = { helpful: '', harmful: '' };

const goalsStorage = createStorage<UserGoals>('user-goals-storage-key', defaultGoals, {
    storageType: StorageType.Local,
    liveUpdate: true,
});

export const savedGoalsStorage: GoalsStorage = goalsStorage;
