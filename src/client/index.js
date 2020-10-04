//TODO Import statements
import { startApp } from './js/app'


import logo from './images/lklogo.jpg';

//Image by Dariusz Sankowski from Pixabay
//https://pixabay.com/photos/old-journey-adventure-photo-map-1130731/ 
import defaultphoto from './images/defaultphoto.jpg';

import './styles/base.scss'
import './styles/footer.scss'
import './styles/header.scss'

// Assistance from https://medium.com/a-beginners-guide-for-webpack-2/handling-images-e1a2a2c28f8d 
var logoImg = document.getElementById('logoImg');
logoImg.src = logo;

var defphoto = document.getElementById('travelImg');
defphoto.src = defaultphoto;

window.addEventListener('DOMContentLoaded', startApp);



//added export statements
export {
    startApp,
}
