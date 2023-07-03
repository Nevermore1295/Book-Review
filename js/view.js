import { component } from "./component.js";
let view = {};

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

view.currentScreen = '';
//Thay đổi giao diện
view.setScreen = (screenName) => {

    const body = document.getElementsByTagName('body')[0];
    console.log(body);
    view.currentScreen = screenName;
    

    switch (screenName){
        case 'homeScreen':
            document.getElementById('app').innerHTML = component.navbar + component.header + component.homeContent + component.footer;
            //Xóa các script không cần thiết
            if (body.contains(script2)){
                body.removeChild(script2);
            }

            if (body.contains(script3)){
                body.removeChild(script3);
            }

            //Thêm script login.js
            if (!body.contains(script1)){
                body.appendChild(script1);
            }
            
            try {
                document.getElementById('navbar-brand').style.cursor = 'pointer';
                document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
                document.getElementById('register').style.cursor = 'pointer';
                document.getElementById('register').addEventListener('click', () => view.setScreen('registerScreen')); ;
            } catch (error) {
                console.log('Error');
            }
            break;

        case 'reviewScreen':
            document.getElementById('app').innerHTML = component.navbar + component.reviewContent + component.footer;
            console.log(app);
            //Xóa các script không cần thiết

            

            //Thêm scriptlogin.js và comment.js

            if (!body.contains(script1)){
                body.appendChild(script1);
            }

            if (!body.contains(script2)){
                body.appendChild(script2);
            }
            break;
        
        case 'registerScreen':
            document.getElementById('app').innerHTML = component.registerNavbar + component.registerContent + component.footer;
            console.log(app);
            //Xóa các script không cần thiết
            if (body.contains(script1)){
                body.removeChild(script1);
            }

            if (body.contains(script2)){
                body.removeChild(script2);
            }

            //Thêm script comment.js
            if (!body.contains(script3)){
                body.appendChild(script3);
            }
            try {
                document.getElementById('navbar-brand').style.cursor = 'pointer';
                document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            } catch (error) {
                console.log('Error');
            }

            break;
        
        default:
            app.innerHTML = component.navbar + component.header + component.homeContent + component.footer;

            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            document.getElementById('register').style.cursor = 'pointer';
            document.getElementById('register').addEventListener('click', () => view.setScreen('registerScreen'));   
        break;

    }
}

view.setScreen();

document.getElementsByTagName('body')[0].addEventListener('loadeddata',()=>{
    console.log(view.currentScreen);
    switch (view.currentScreen){
        case 'homeScreen':
            //Thêm sự kiện onclick chuyển trang
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            document.getElementById('register').style.cursor = 'pointer';
            document.getElementById('register').addEventListener('click', () => view.setScreen('registerScreen'));            
            break;

        case 'reviewScreen':
            //Thêm sự kiện onclick chuyển trang
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            break;
        
        case 'registerScreen':
            //Thêm sự kiện onclick chuyển trang
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
    }
})
  