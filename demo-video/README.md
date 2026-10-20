# Запись демонстрации

Короткое вертикальное видео приложения. Перед записью должен работать сервер:

```bash
cd centr-roz-app
npm run dev
```

Запись, в отдельном окне Chromium, без звука и без рамки браузера:

```bash
cd demo-video
npm install
npx playwright install chromium
npm run record
```

Сценарий лежит в `record.mjs`. Он открывает чистый контекст браузера и не трогает обычный профиль. Готовые файлы:

- `centr-roz-demo.webm`
- `centr-roz-demo.mp4`
