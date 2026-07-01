'use client';

import { createContext, type ReactNode } from 'react';

// project imports
import defaultConfig, { type MenuOrientation, type ThemeMode, type ThemeDirection } from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import type { CustomizationProps, FontFamily, I18n, PresetColor } from 'types/config';

// initial state
const initialState: CustomizationProps = {
  ...defaultConfig,
  onChangeMenuOrientation: () => {},
  onChangeMiniDrawer: () => {},
  onChangeMode: () => {},
  onChangePresetColor: () => {},
  onChangeLocale: () => {},
  onChangeDirection: () => {},
  onChangeContainer: () => {},
  onChangeFontFamily: () => {},
  onChangeBorderRadius: () => {},
  onChangeOutlinedField: () => {},
  onReset: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
  // Key bumped so existing users pick up the new MongoDB defaults rather than a persisted
  // stale config. v2: default flipped back to dark mode (toggle temporarily hidden).
  const [config, setConfig] = useLocalStorage('mongodb-config-v2', {
    menuOrientation: initialState.menuOrientation,
    miniDrawer: initialState.miniDrawer,
    fontFamily: initialState.fontFamily,
    borderRadius: initialState.borderRadius,
    outlinedFilled: initialState.outlinedFilled,
    mode: initialState.mode,
    presetColor: initialState.presetColor,
    i18n: initialState.i18n,
    themeDirection: initialState.themeDirection,
    container: initialState.container
  });

  const onChangeMenuOrientation = (menuOrientation: MenuOrientation) => {
    setConfig({
      ...config,
      menuOrientation
    });
  };

  const onChangeMiniDrawer = (miniDrawer: boolean) => {
    setConfig({
      ...config,
      miniDrawer
    });
  };

  const onChangeMode = (mode: ThemeMode) => {
    setConfig({
      ...config,
      mode
    });
  };

  const onChangePresetColor = (presetColor: PresetColor) => {
    setConfig({
      ...config,
      presetColor
    });
  };

  const onChangeLocale = (i18n: I18n) => {
    setConfig({
      ...config,
      i18n
    });
  };

  const onChangeDirection = (themeDirection: ThemeDirection) => {
    setConfig({
      ...config,
      themeDirection
    });
  };

  const onChangeContainer = (container: boolean) => {
    setConfig({
      ...config,
      container
    });
  };

  const onChangeFontFamily = (fontFamily: FontFamily) => {
    setConfig({
      ...config,
      fontFamily
    });
  };

  const onChangeBorderRadius = (event: Event, newValue: number | number[]) => {
    setConfig({
      ...config,
      borderRadius: newValue as number
    });
  };

  const onChangeOutlinedField = (outlinedFilled: boolean) => {
    setConfig({
      ...config,
      outlinedFilled
    });
  };

  const onReset = () => {
    setConfig({ ...defaultConfig });
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeMenuOrientation,
        onChangeMiniDrawer,
        onChangeMode,
        onChangePresetColor,
        onChangeLocale,
        onChangeDirection,
        onChangeContainer,
        onChangeFontFamily,
        onChangeBorderRadius,
        onChangeOutlinedField,
        onReset
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export { ConfigProvider, ConfigContext };
