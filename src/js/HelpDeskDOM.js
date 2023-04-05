/* eslint-disable linebreak-style */
export default class HelpDeskDOM {
  constructor() {
    this.container = null; // for container
    this.headers = {
      create: 'Добавить тикет',
      edit: 'Изменить тикет',
      remove: 'Удалить тикет',
    };

    this.ticketsAddListeners = [];
    this.formCancelListeners = [];
    this.formOkListeners = [];
    this.ticketsClickListeners = [];
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('ListEditPlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();

    this.container.innerHTML = `
        <header class="header">
          <p>Домашнее задание к занятию "7. Работа с HTTP"</p>
          <p>HelpDesk</p>
        </header>
        <div class="helpdesk-container">
          <div class="btn-add-ticket-container">
            <button class="btn btn-add-ticket">Добавить тикет</button>
          </div>
          <ul class="tickets-list"></ul>
        </div>
      `;

    // вставка формы на страницу
    this.popupForm();

    // элементы: кнопка добавить тикет и блок списока тикетов
    this.ticketAdd = this.container.querySelector('.btn-add-ticket');
    this.ticketsList = this.container.querySelector('.tickets-list');

    // прослушивание клика по кнопке добавить тикет и по блоку с тикетами
    this.ticketAdd.addEventListener('click', (event) => this.onTicketsAdd(event));
    this.ticketsList.addEventListener('click', (event) => this.onTicketsClick(event));
  }

  // форма для добавления, изменения и удаления тикета
  popupForm() {
    this.modalContainerForm = document.createElement('div'); // создаём див
    this.modalContainerForm.innerHTML = `
        <form class="ticket-form">
          <div class="ticket-form-header"></div>
          <div class="form-text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</div>
          <div class="ticket-form-label-container">
            <div class="ticket-form-label" data-id="container-name">
              <label class="ticket-form-label-text" for="ticket-name">Краткое описание</label>
              <input class="ticket-form-label-field" type="text" name="ticket-name" id="ticket-name">
            </div>
            <div class="ticket-form-label" data-id="container-description"> 
              <label class="ticket-form-label-text" for="ticket-description">Подробное описание</label>
              <textarea class="ticket-form-label-field" name="ticket-description" id="ticket-description"></textarea >
            </div>
            </div>
          <div class="ticket-form-button-container"> 
            <button data-id="form-cancel" class="btn btn-form">Отмена</button>
            <button data-id="form-ok" class="btn btn-form" type="button">Ok</button>
          </div>
        </form>
      `;
    // добавляем классы форме
    this.modalContainerForm.classList.add('ticket-form-container');
    this.modalContainerForm.classList.add('disable');

    // заголовок формы
    this.formHeader = this.modalContainerForm.querySelector('.ticket-form-header');

    // Описание формы
    this.formDescription = this.modalContainerForm.querySelector('.form-text');

    // контейнер с лейблами
    this.formLabelContainer = this.modalContainerForm.querySelector('.ticket-form-label-container');

    // инпут с именем и описанием
    this.ticketName = this.modalContainerForm.querySelector('#ticket-name');
    this.ticketDescription = this.modalContainerForm.querySelector('#ticket-description');

    // кнопка отмена и ок
    this.formCancel = this.modalContainerForm.querySelector('[data-id=form-cancel]');
    this.formOk = this.modalContainerForm.querySelector('[data-id=form-ok]');

    // собития на кнопку отмена и ок
    this.formCancel.addEventListener('click', (event) => this.onFormCancel(event));
    this.formOk.addEventListener('click', (event) => this.onFormOk(event));

    // вставка формы в DOM
    this.container.appendChild(this.modalContainerForm);
  }

  // открытие/закрытие и изменение значений формы
  ticketFormChange(active, name, description, called = '', ticketID = false, formType = 'open') {
    if (active) { this.modalContainerForm.classList.remove('disable'); }
    if (!active) { this.modalContainerForm.classList.add('disable'); }

    // изменяем заголовок
    this.formHeader.textContent = this.headers[called] || '';

    // если форма для создания или изменения
    if (formType === 'open') {
      this.formLabelContainer.classList.remove('disable');
      this.formDescription.classList.add('disable');

      this.ticketName.value = name;
      this.ticketDescription.value = description;
    }

    if (formType === 'delete') {
      this.formLabelContainer.classList.add('disable');
      this.formDescription.classList.remove('disable');
    }

    this.modalContainerForm.dataset.called = called;
    this.modalContainerForm.dataset.id = ticketID;
  }

  addFormCancelListeners(callback) { this.formCancelListeners.push(callback); }

  // кнопка отмена на форме
  onFormCancel(e) {
    e.preventDefault();
    this.formCancelListeners.forEach((o) => o.call(null, ''));
  }

  addFormOkListeners(callback) { this.formOkListeners.push(callback); }

  // кнопка ок на форме
  onFormOk(e) {
    e.preventDefault();
    const name = this.ticketName.value;
    const description = this.ticketDescription.value;
    const { called, id } = this.modalContainerForm.dataset;
    const value = {
      name,
      description,
      called,
      id,
    };

    this.formOkListeners.forEach((o) => o.call(null, value));
  }

  addTicketsAddListeners(callback) { this.ticketsAddListeners.push(callback); }

  // кнопка добавить тикет, открывает форму
  onTicketsAdd(e) {
    e.preventDefault();
    this.ticketsAddListeners.forEach((o) => o.call(null, ''));
  }

  addTicketsClickListeners(callback) { this.ticketsClickListeners.push(callback); }

  // общий клик по блоку с тикетами
  onTicketsClick(e) {
    e.preventDefault();

    const { target } = e;
    const ticket = target.closest('.ticket');

    if (!ticket) { return; }

    const ticketID = ticket.dataset.id;
    const dataID = target.dataset.id;

    this.ticketsClickListeners.forEach((o) => o.call(null, { dataID, ticketID }));
  }

  // HTML тикета
  static ticketHtml(id, name, status, createdTime) {
    let ticketCompleted = '&#x2714;';

    if (!status) { ticketCompleted = ''; }

    const ticket = document.createElement('li');
    ticket.classList.add('ticket');
    ticket.dataset.id = id;

    ticket.innerHTML = `
        <span class="ticket-completed" data-id="completed">${ticketCompleted}</span>
        <span class="ticket-text">
          <p class="ticket-text-name">${name}</p>
        </span>
        <span class="ticket-date">${createdTime}</span>
        <span class="ticket-edit" data-id="edit">&#x270E;</span>
        <span class="ticket-remove" data-id="remove">&#x2716;</span>
      `;

    return ticket;
  }

  // создание и добавление тикета в дом
  ticketCreateAndAdd(ticket) {
    const {
      id,
      name,
      status,
      created,
    } = ticket;

    const createdTime = this.constructor.dateToConvert(created);
    const ticketHtml = this.constructor.ticketHtml(id, name, status, createdTime);

    this.ticketsList.appendChild(ticketHtml);
  }

  // отрисовка всех тикетов в дом
  ticketRender(tickets) {
    this.ticketsList.innerHTML = '';
    for (let i = 0; i < tickets.length; i += 1) {
      this.ticketCreateAndAdd(tickets[i]);
    }
  }

  // получить значения тикета
  ticketGetValue(id) {
    const ticket = this.ticketsList.querySelector(`[data-id="${id}"]`);
    if (!ticket) { return false; }

    return ticket.querySelector('.ticket-text-name').textContent;
  }

  // изменение состояния тикета
  ticketCompleted(id, status) {
    const ticket = this.ticketsList.querySelector(`[data-id="${id}"]`);

    if (!ticket) { return; }
    const completed = ticket.querySelector('.ticket-completed');

    if (status) {
      completed.innerHTML = '&#x2714;';
    }

    if (!status) {
      completed.innerHTML = '';
    }
  }

  // удалить тикет в DOM
  tickedRemove(id) {
    const ticket = this.ticketsList.querySelector(`[data-id="${id}"]`);
    if (!ticket) { return; }
    this.ticketsList.removeChild(ticket);
  }

  // изменить тикет в дом
  tickedEdit(id) {
    const ticket = this.ticketsList.querySelector(`[data-id="${id}"]`);
    if (!ticket) { return; }

    const nameEl = ticket.querySelector('.ticket-text-name');
    nameEl.textContent = this.ticketName.value;
  }

  // если описание есть, то оно удаляется
  checkAndRemoveDescription(id) {
    // находим блок с тикетом, если тикет не найден, то оставка
    const ticket = this.ticketsList.querySelector(`[data-id="${id}"]`);
    if (!ticket) { return false; }

    // поиск описания
    const descriptionText = ticket.querySelector('.ticket-text-description');

    if (descriptionText) {
      descriptionText.remove();
      return true;
    }

    return false;
  }

  // открыть или скрыть описание
  createDescription(id, text) {
    // находим блок с тикетом, если тикет не найден, то оставка
    const ticket = this.ticketsList.querySelector(`[data-id="${id}"]`);
    if (!ticket) { return false; }

    // находим блок с контейнером, если контейнер не найден, то оставка
    const containerText = ticket.querySelector('.ticket-text');
    if (!containerText) { return false; }

    // создаём параграф для описания
    const paragraph = document.createElement('p');

    // задаём класс и значение параграфу
    paragraph.classList.add('ticket-text-description');
    paragraph.textContent = text;

    // вставляем параграф с описанием
    containerText.appendChild(paragraph);

    return true;
  }

  loading(value) {
    if (value) {
      this.loadingDiv = document.createElement('div');
      this.loadingDiv.textContent = 'Loading...';
      this.loadingDiv.classList.add('loading');
      this.ticketsList.appendChild(this.loadingDiv);
    }

    if (!value) {
      this.loadingDiv.remove();
    }
  }

  // метод конвертации даты в читабельную
  static dateToConvert(dateValue) {
    const dateTimezone = new Date(dateValue);
    const date = dateTimezone.toLocaleDateString();
    const time = dateTimezone.toLocaleTimeString();

    return `${date} ${time}`;
  }
}
