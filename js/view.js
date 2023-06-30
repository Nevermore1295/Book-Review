import { component } from "./component.js";
const view = {};
// Thay doi giao dien
view.setScreen = (screenName) => {
    
    switch (screenName){
        case 'homepageScreen':
            document.getElementById('app').innerHTML = component.navbar + component.header + component.homepage + component.footer;
            document.getElementById('script').setAttribute('src','../js/login.js')
            break;

        case 'postScreen':
            document.getElementById('app').innerHTML =component.navbar + component.header + component.post + component.footer;
            document.getElementById('script').setAttribute('src','../js/login.js')
            break;
        
        case 'registerScreen':
            document.getElementById('app').innerHTML = component.registerNavbar + component.register + component.footer;
            document.getElementById('script').setAttribute('src','../js/register.js')
            break;
    }
}

view.setScreen('homepageScreen');
