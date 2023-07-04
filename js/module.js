import { component } from "./component.js";

export const userAuth = (token) => {
    if (token == true)
        return component.navbarUsername;
    else 
        return component.navbarLoginForm;
}