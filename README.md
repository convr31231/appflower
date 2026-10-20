# Дисконт Центр Роз — демонстрация приложения

Прототип брендированного приложения цветочного магазина «Дисконт Центр Роз» в Нижнем Новгороде. Это концепция для разговора с владельцем: каталог, бонусная карта, избранное и важные даты. Покупки, оплата и регистрация не выполняются.

Онлайн: [https://convr31231.github.io/appflower/](https://convr31231.github.io/appflower/)

Сайт собирается через GitHub Actions и публикуется на GitHub Pages из папки `dist`. В настройках репозитория источник Pages должен быть **GitHub Actions**.

## Запуск

```bash
cd centr-roz-app
npm install
npm run dev
```

Локально приложение открывается по адресу `http://localhost:5173/appflower/`.

Сборка и тесты:

```bash
npm test
npm run build
npm run preview
```

## Сценарий показа

1. На главной покажите приветствие, баннер и три букета из подборки.
2. Откройте каталог: поиск по составу, фильтр «Розы» или «До 3 000 ₽», сердечко в избранном. Карточка букета ведёт на страницу товара на сайте магазина.
3. На «Моей карте» покажите баланс 840 бонусов и QR-код `DEMO-CENTRROZ-001`.
4. Откройте панель сотрудника. Для покупки 3 000 ₽ начисление — 150 бонусов. При списании с баланса 840 можно списать 600 бонусов, к оплате останется 2 400 ₽.
5. Добавьте и удалите важную дату. Рядом с датой есть переход к выбору букета.
6. В профиле измените имя и, если нужно вернуть исходный вид, сбросьте демонстрацию.

## Ограничения

- Нет сервера, входа, SMS, оплаты и кассы.
- Имя, баланс, история, избранное и даты хранятся в `localStorage` этого браузера. Другое устройство их не увидит.
- Условия бонусов — предложение для обсуждения, не действующая программа магазина.
- Повтор одного и того же подтверждения не применяется второй раз. Новая покупка с той же суммой учитывается отдельно.
- Напоминания о датах не отправляются.
- Цены и наличие демонстрационные.

## Источники

Фотографии, логотип и примеры цен взяты с сайта [centrroznn.ru](https://centrroznn.ru) и сохранены в `public/assets`.

Адреса салонов сверены с сайтом:

- Родионова, 195 — +7 903 602-23-74
- Гагарина, 101/4 — +7 903 601-02-74
- Рождественская, 41 — +7 903 602-72-74
- Куйбышева, 2 — +7 903 601-05-74

Карточки букетов:

- [Волшебный](https://centrroznn.ru/catalog/monobukety/buket-volshebnyi-iz-9-diantusov.html)
- [История любви](https://centrroznn.ru/catalog/sbornye-bukety/buket-istoriya-lyubvi-s-rozami_3112.html)
- [Лунный свет S](https://centrroznn.ru/catalog/sbornye-bukety/buket-lunnyi-svet-s-s-rozami-sofi-loren-gerberami-i-evkaliptom.html)
- [51 роза](https://centrroznn.ru/catalog/monobukety/buket-51-roza-60-sm-pod-lentu.html)
- [Благородный шик](https://centrroznn.ru/catalog/sbornye-bukety/buket-blagorodnyi-shik-s-rozami-sofi-loren-eustomoi-i-evkaliptom.html)
- [Первый поцелуй](https://centrroznn.ru/catalog/sbornye-bukety/buket-pervyi-potselui-s-rozami-sofi-loren-diantusami-yagodkami-i-evkaliptom.html)
- [Сладкий ноябрь](https://centrroznn.ru/catalog/monobukety/buket-sladkii-noyabr-iz-21-rozy-60-sm-v-foamirane_1731.html)
- [15 роз](https://centrroznn.ru/catalog/monobukety/buket-nedeli-15-roz-s-fistashkoi-i-oformleniem.html)
