//TODO Import statements

/*import { handleSubmit } from './js/formHandler'
import { validURL} from './js/urlValidation'*/

import logo from './images/lklogo.jpg';
import newsbackgroundImg  from './images/global-news.jpg';

import './styles/base.scss'
import './styles/footer.scss'
import './styles/header.scss'

// Assistance from https://medium.com/a-beginners-guide-for-webpack-2/handling-images-e1a2a2c28f8d 
var logoImg = document.getElementById('logoImg');
logoImg.src = logo;

var mainImg = document.getElementById('mainImg');
mainImg.src = newsbackgroundImg;

//added export statements
export {
    handleSubmit,
    validURL,
}
