import ChooseConn from 'salesforceapp-pageobjects/pageObjects/authentication/chooseConn';
import Eula from 'salesforceapp-pageobjects/pageObjects/authentication/eula';
import Login from 'salesforce-pageobjects/helpers/pageObjects/login';
import LoginNavBar from 'salesforceapp-pageobjects/pageObjects/authentication/loginNavBar';
import LoginNavBarOptions from 'salesforceapp-pageobjects/pageObjects/authentication/loginNavBarOptions';
import loaderConfig from 'salesforceapp-pageobjects/mobileSF.config.json';

describe('Test Salesforce App', () => {
    it('testLogin', async () => {
        utam.setLoaderConfig(loaderConfig);
        const eula = await utam.load(Eula);
        await eula.accept();

        const loginNavBar = await utam.load(LoginNavBar);
        await loginNavBar.chooseConnOption();

        if (browser.isAndroid) {
            const options = await utam.load(LoginNavBarOptions);
            await options.changeServer();
        }

        const choosConn = await utam.load(ChooseConn);
        await choosConn.switchConnection('Sandbox');

        if (browser.isAndroid) {
            browser.back();
        }

        utam.setBridgeAppTitle('Login | Salesforce');
        const login = await utam.load(Login);
    });
});
