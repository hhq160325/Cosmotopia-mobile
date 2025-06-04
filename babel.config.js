module.exports = (api) => {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Cosmotopia custom babel plugins can be added here
    ],
  }
}
