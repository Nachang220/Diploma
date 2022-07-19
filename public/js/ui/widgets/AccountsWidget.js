/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Элемент не существует");
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = document.querySelector(".create-account");
    createAccount.addEventListener("click", () => {
      App.getModal("createAccount").open();
    });

    this.element.addEventListener("click", (event) => {
      const account = event.target.closest(".account");
      if (account) {
        this.onSelectAccount(account);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();
    if (currentUser) {
      Account.list(currentUser, (error, response) => {
        if (response?.success) {
          this.clear();
          response.data.forEach((item) => {
            this.renderItem(item);
          });
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = document.querySelectorAll(".account");
    accounts.forEach((account) => {
      account.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeElement = document.querySelector(".active");
    if (activeElement) {
      activeElement.classList.remove("active");
    }
    element.classList.add("active");
    const currentAccountId = element.dataset.id;
    App.showPage("transactions", {account_id: currentAccountId});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML({id, name, sum}) {
    const newAccount = document.createElement("li");
    newAccount.className = "account";
    newAccount.dataset.id = id;
    newAccount.innerHTML = `<a href="#"><span>${name}</span> / <span>${sum.toLocaleString()} ₽</span></a>`;

    return newAccount;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    this.element.append(this.getAccountHTML(data));
  }
}
