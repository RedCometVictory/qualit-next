const globalTheme = async (newTheme) => {
  localStorage.setItem('qual__theme', newTheme)
  return newTheme;
};

const unsplashTheme = async (openDrawer) => {
  return openDrawer;
};

const backgroundImageTheme = async (bgImage) => {
  return bgImage;
};

const themeService = {
  globalTheme,
  unsplashTheme,
  backgroundImageTheme
};
export default themeService;