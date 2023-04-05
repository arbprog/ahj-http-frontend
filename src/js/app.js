/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import HelpDeskControl from './HelpDeskControl';
import HelpDeskDOM from './HelpDeskDOM';
import HelpDeskAPI from './HelpDeskAPI';

// элемент блока div в DOM
const hw = document.querySelector('#hw');

// создание класса отвечающего за DOM
const helpDeskDOM = new HelpDeskDOM();

// присвоению блока DIV, класса отвечающего за DOM
helpDeskDOM.bindToDOM(hw);

// ссылка на baсkend
// const baseURL = 'http://localhost:7070';
const baseURL = 'https://ahj-hw7-1.onrender.com/';

// создание класса отвечающего за API и присвоение ему ссылки на bakend
const helpDeskAPI = new HelpDeskAPI(baseURL);

// создание класса отвечающего за контроль
const helpDeskControll = new HelpDeskControl(helpDeskDOM, helpDeskAPI);

// запуск метода инициализирующий страт
helpDeskControll.init();

console.log('app started');
