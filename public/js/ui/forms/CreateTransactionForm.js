/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const select = this.element.querySelector(".accounts-select");
    Account.list(User.current(), (error, response) => {
      if (response?.success) {
        select.innerHTML = response.data.reduce((option, item) => {
          return option + `<option value="${item.id}">${item.name}</option>`;
        }, "");
      }
    });
  }


  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const typeModal = this.element.closest(".modal").dataset.modalId;
    Transaction.create(data, (err, response) => {
      if (response?.success) {
        this.element.reset();
        App.getModal(typeModal).close();
        App.update();
      }
    });
  }
}