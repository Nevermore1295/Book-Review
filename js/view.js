import { component } from "./component.js";
const view = {};
// Thay doi giao dien
view.setScreen = (screenName) => {
    switch (screenName){
        case 'homepageScreen':

            document.getElementById('app').innerHTML = component.navbar + component.header + component.homepage + component.footer;
            break;

        case 'postScreen':
            document.getElementById('app').innerHTML =component.navbar + component.header + component.post + component.footer;
            break;
        
        case 'registerScreen':
            document.getElementById('app').innerHTML = component.registerNavbar + component.register + component.footer;
            break;
    }
}

view.setScreen('homepageScreen');
