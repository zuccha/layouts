import { useStorePersistentBoolean } from "../utils/store-persistent";

export const useShowCardGuide = () =>
  useStorePersistentBoolean("settings.view.guide.card", false);

export const useShowBleedGuide = () =>
  useStorePersistentBoolean("settings.view.guide.bleed", false);
