const { baseMobileConfig } = require('./wdio.conf.shared');

exports.config = {
    ...baseMobileConfig,
    capabilities: [
        {
            platformName: 'Android',
            'appium:orientation': 'PORTRAIT',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': 'emulator-5554',
            'appium:app': '<path to Android test app>',
            'appium:appActivity': 'com.salesforce.chatter.Chatter',
            'appium:appPackage': 'com.salesforce.chatter',
            'appium:newCommandTimeout': 240,
        },
    ],
};
