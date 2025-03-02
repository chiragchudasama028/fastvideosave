export default {
  executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  stealthOptions: {
    addLanguage: true,
    hideWebDriver: true,
    mockChrome: true,
  },
  commonArgs: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-blink-features=AutomationControlled",
    "--disable-dev-shm-usage",
    "--disable-web-security"
  ]
};