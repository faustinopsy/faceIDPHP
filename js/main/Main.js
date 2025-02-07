import Navbar from './componentes/Navbar.js';
import Camera from './componentes/Camera.js';
import FaceRegister from './componentes/FaceRegister.js';
import User from './componentes/User.js';
import * as faceapi from '../face-api.js';
import ModelLoader from './ModelLoader.js';
import Api from '../utils/api.js';

import RecognitionBackend from './componentes/RecognitionBackend.js';

const camera = new Camera();
const mainContainer = document.getElementById('main-container');
const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const modelLoader = new ModelLoader(faceapi);
modelLoader.loadModels();

const userApiUrl = "../../app/";
const apiStrategy =  new Api(userApiUrl);
const debugEnabled = true

function navigate(link) {
    
    if (link === 'logout') {
        localStorage.removeItem('isLoggedIn'); 
        location.reload();
        
        return;
    }
    mainContainer.innerHTML = '';
    let componentInstance;
    location.hash=link
    switch (link) {
        case 'register': componentInstance = new FaceRegister(apiStrategy); break;
        case 'login': 
        const onLoginSuccess = () => navigate('users'); 
        componentInstance = new RecognitionBackend(camera,apiStrategy,debugEnabled, navbar, onLoginSuccess); break;
        case 'users':
            const userComponent = new User(userApiUrl,apiStrategy);
            userComponent.render().then(renderedElement => {
                mainContainer.appendChild(renderedElement);
            });
            break;
    }
    if (componentInstance) {
        mainContainer.appendChild(componentInstance.render());
    }
}

const navbar = new Navbar(navigate,isUserLoggedIn);
document.body.insertBefore(navbar.render(), mainContainer);
navigate(location.hash.substring(1))