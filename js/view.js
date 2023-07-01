import { component } from "./component.js";
const view = {};

//Hàm khởi tạo module script 
function createModule(src){
    const script = document.createElement('script');
    script.setAttribute('type','module');
    script.setAttribute('src',src);
    return script;
}

//Các biến script element
const script1 = createModule('../js/login.js');
const script2 = createModule('../js/comment.js');
const script3 = createModule('../js/register.js');

// Thay doi giao dien
view.setScreen = (screenName) => {
    switch (screenName){
        case 'homepageScreen':
            document.getElementById('app').innerHTML = component.navbar + component.header + component.homepage + component.footer;
                        
            //Thêm script login.js
            document.getElementsByTagName('body')[0].appendChild(script1);          
            break;

        case 'postScreen':
            document.getElementById('app').innerHTML = component.navbar + component.header + component.post + component.footer;

            //Thêm module login.js và comment.js vào thẻ body
            document.getElementsByTagName('body')[0].appendChild(script1);
            document.getElementsByTagName('body')[0].appendChild(script2);

            break;
        
        case 'registerScreen':
            document.getElementById('app').innerHTML = component.registerNavbar + component.register + component.footer;

            //Thêm module comment.js vào thẻ lobby
            document.getElementsByTagName('body')[0].appendChild(script3);
            break;
    }
}

view.setScreen('postScreen');
