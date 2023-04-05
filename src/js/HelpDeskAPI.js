/* eslint-disable linebreak-style */
export default class HelpDeskAPI {
  constructor(url) {
    this.baseURL = url;
  }

  // опции для запроса
  static options(method, urlParam, body) {
    const value = {
      method,
      body: JSON.stringify(body),
      urlParam,
    };

    return value;
  }

  // создание апи запроса
  async createRequest(options) {
    const { method, urlParam, body } = options;

    const newUrl = `${this.baseURL}/${urlParam}`;

    const response = await fetch(newUrl, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body,
    });

    const result = await response.json();

    if (!result) { return false; }

    return result;
  }

  // создание тикета
  async createTicket(body) {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('POST', '?method=createTicket', body);
    const response = await this.createRequest(options);

    // проверка, есть ли нужный объект
    const { created } = response;

    return created;
  }

  // удалить тикет
  async removeTicket(ticketID) {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('DELETE', `?method=removeTicket&id=${ticketID}`);
    const response = await this.createRequest(options);

    // проверка, есть ли нужный объект
    const { removed } = response;

    return removed;
  }

  // поулчить тикеты
  async allTickets() {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('GET', '?method=allTickets');
    const response = await this.createRequest(options);

    // проверка, есть ли нужный объект
    const { tickets } = response;

    return tickets;
  }

  // описание тикета
  async descriptionTickets(ticketID) {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('GET', `?method=ticketById&id=${ticketID}`);
    const response = await this.createRequest(options);

    // проверка, есть ли нужный объект
    const { description } = response;

    return description;
  }

  // статус тикета
  async сompletedTicket(ticketID) {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('PUT', `?method=ticketCompleted&id=${ticketID}`);
    const response = await this.createRequest(options);

    // проверка, есть ли нужный объект
    const { status } = response;

    return status;
  }

  // изменение тикета
  async editTicket(ticketID, body) {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('PUT', `?method=ticketEdit&id=${ticketID}`, body);
    const response = await this.createRequest(options);

    // проверка, есть ли нужный объект
    const { edited } = response;

    return edited;
  }
}
