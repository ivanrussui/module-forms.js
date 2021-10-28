// ! импорты должны быть в самом верху
import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

// ? пишем функцию и внутрь перемещаем участок кода из файла script.js
function forms(formSelector, modalTimerId) { // ! передаем аргументы которые принимают селекторы из файла scripts.js
	// реализуем отправку данных форм, т.к. их 2 то делаем чер функ

	// получаем формы
	const forms = document.querySelectorAll(formSelector);

	// объект который будет вводть юзеру сообщение в зависимости от ситуации
	const message = {
		loading: 'img/form/spinner.svg',
		succes: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	// подвязываем под все формы bindPostData
	forms.forEach(item => {
		bindPostData(item);
	});


	// функция отвечающая за привязку постинга
	function bindPostData(form) {
		// событие 'submit', (объект событие) срабатывает каждый раз когда пытаемся отправить форму
		form.addEventListener('submit', (e) => {
			// отменяем стандартное поведение браузера
			e.preventDefault(); // надо писать в начале

			// при отправки запроса юзера будем уведомлять
			// создаем img
			const statusMessage = document.createElement('img');
			// обращаемся к атрибуту
			statusMessage.src = message.loading;
			// как только отправили запрос нажали submit (кнопку отправки формы)  (увидит тока если медленный интернет)
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;

			// отправляем на страницу statusMessage
			// form.append(statusMessage); // тут спинер ломает внизу верстку где форма не в модалке
			// аппендит спинер не в саму форму а после нее. в модалке ниче не поменяется
			// insertAdjacentElement('куда вставляем afterend это после формы', что нужно вставить)
			form.insertAdjacentElement('afterend', statusMessage);


			// работа с сервером fetch api

			// через JSON
			// в перемен конструктор FormData(форма из которой нужно собрать данные)
			// берем formData которая собрала все данные с формы
			const formData = new FormData(form); // ! важно чтобы в верстке у input были атрибуты name

			// entries() превращает объект в массив массивов т.е. в матрицу
			// fromEntries() делает обратно из матрицы в объект
			// данные с формы полученные выше превращаем в матрицу, после в классический объект, а после в JSON
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			// JSON полученный выше отправляем на сервер
			postData('http://localhost:3000/requests', json) // (url, body который пойдет на сервер)
				.then(data => { // обрабатываем результат запроса через промисы
					// с сервера вернется data
					console.log(data);
					// когда мы сделали запрос и все успешно пришло выводим сообщение succes: 'Спасибо! Скоро мы с вами свяжемся'
					showThanksModal(message.succes);
					// удаляем statusMessage со страницы
					statusMessage.remove();
				}).catch(() => { // пишем операцию которая соотвествует ошибке
					// catch() есть особенность если к примеру указать путь к серверу не тот, то он все равно выполнит resolve. а вот если к примеру нет сети 404 ошибка и тогда он выполнит reject
					// выводим сообщение failure: 'Что-то пошло не так...'
					showThanksModal(message.failure);
				}).finally(() => { // действие которое будет выполняться всегда вне зависимости от результата
					// очистка формы после успешной отправки
					form.reset(); // обращаемся к форме и метод reset() очищает ее. альтернатива это в этой форме перебрать инпуты и очистить их вэлью
				});
		});
	}


	// функция показывает модалку с благодарностью юзеру/ message это будет сообщ кот будет показ юзеру о статусе отправки
	function showThanksModal(message) { // message будем брать из const message котор выше писали при отправке запросов
		const prevModalDialog = document.querySelector('.modal__dialog');

		// скрываем этот блок (не удаляем т к юзер может открыть модалку и попытаться отправить форму)
		prevModalDialog.classList.add('hide');


		// задача открыть класс модал и сформировать структуру внутри

		// открываем модалку openModal() есть выше в коде когда писали модалку
		openModal('.modal', modalTimerId); // (селектор модальн окна кот будем закрывать, modalTimerId приходит из файла script.js)

		// нужно создать блок обвертка
		const thanksModal = document.createElement('div'); // создаем див
		// добавляем класс. по сути заменяем класс тот что выше скрыли
		thanksModal.classList.add('modal__dialog');
		// формируем внутри верстку
		thanksModal.innerHTML = `
			<div class='modal__content'>
				<div class='modal__close' data-close>×</div>
				<div class='modal__title'>${message}</div>
			</div>
		`;
		// помещаем на страницу thanksModal
		document.querySelector('.modal').append(thanksModal);

		// нужно чтобы все через время возвращалось обратно
		setTimeout(() => {
			thanksModal.remove(); // убирать thanksModal
			// показывать предидущий контент
			prevModalDialog.classList.add('show'); // доб класс show
			prevModalDialog.classList.remove('hide'); // убир класс hide
			closeModal('.modal'); // закр мод окно (селектор модальн окна кот будем закрывать)
		}, 2000);
	}
}

// ! экспортируем используя ES6
export default forms;