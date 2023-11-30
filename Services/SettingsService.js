import { ReadSettingsAsync } from "../Repositories/SettingsRepository.js";

export const GetSettingsAsync = async (user) => {
  try {
    const settings = await ReadSettingsAsync(user);
    return settings?.rows?.map?.((taskBlock) => {
      return {
        id: settings.id,
        workBlockDuration: settings.work_block_duration,
        breakBlockDuration: taskBlock.break_block_duration,
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
