import {
  ReadSettingsAsync,
  UpsertSettingsPsqlAsync,
} from "../Repositories/SettingsRepository.js";

export const GetSettingsAsync = async (user) => {
  try {
    const settings = await ReadSettingsAsync(user);
    return settings?.rows?.map?.((settings) => {
      return {
        id: settings.id,
        workBlockDuration: settings.work_block_duration,
        breakBlockDuration: settings.break_block_duration,
      };
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const UpsertSettingsAsync = async (settings, user) => {
  try {
    // todo: validation

    return await UpsertSettingsPsqlAsync(settings, user);
  } catch (e) {
    console.log(e.message);
  }
};
