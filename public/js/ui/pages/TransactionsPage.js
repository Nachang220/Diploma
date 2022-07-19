/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Элемент не существует");
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = this.element.querySelector(".remove-account");
    removeAccount.addEventListener("click", () => {
      this.removeAccount();
    });

    this.element.addEventListener("click", (event) => {
      const removeTransaction = event.target.closest(".transaction__remove");
      if (removeTransaction) {
        this.removeTransaction(removeTransaction.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (confirm("Вы действительно хотите удалить счёт?")) {
        Account.get(this.lastOptions.account_id, (error, response) => {
          if (response?.success) {
            Account.remove(response.data, (error, response) => {
              if (response?.success) {
                App.updateWidgets();
                App.updateForms();
              }
              this.clear();
            });
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
      Transaction.remove({id}, (error, response) => {
        if (response?.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    this.lastOptions = options;
    Account.get(this.lastOptions["account_id"], (error, response) => {
      if (response?.success) {
        this.renderTitle(response.data.name);
        Transaction.list(this.lastOptions, (error, response) => {
          if (response?.success) {
            this.renderTransactions(response.data);
          }
        });
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    document.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(dateAndTime) {
    dateAndTime = dateAndTime.slice(0, 19);
    let date;
    let time;
    if (dateAndTime.includes("T")) {
      [date, time] = dateAndTime.split("T");
    } else {
      [date, time] = dateAndTime.split(" ");
    }
    let [year, month, day] = date.split("-");
    if (day.startsWith("0")) {
      day = day.slice(1);
    }
    let [hours, minutes] = time.split(":");
    switch (month) {
      case "01" : {
        month = "января";
        break;
      }
      case "02" : {
        month = "февраля";
        break;
      }
      case "03" : {
        month = "марта";
        break;
      }
      case "04" : {
        month = "апреля";
        break;
      }
      case "05" : {
        month = "мая";
        break;
      }
      case "06" : {
        month = "июня";
        break;
      }
      case "07" : {
        month = "июля";
        break;
      }
      case "08" : {
        month = "августа";
        break;
      }
      case "09" : {
        month = "сентября";
        break;
      }
      case "10" : {
        month = "октября";
        break;
      }
      case "11" : {
        month = "ноября";
        break;
      }
      case "12" : {
        month = "декабря";
        break;
      }
    }
    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `
      <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <div class="transaction__date">${this.formatDate(item.created_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
            ${item.sum.toLocaleString()} <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    this.element.querySelector(".content").innerHTML = data.reduceRight((content, item) => {
      return content + this.getTransactionHTML(item);
    }, "");
  }
}