# Part:time Supabase MVP

React/Vite frontend + Supabase backend.

## Что есть

- Регистрация / вход через Supabase Auth
- Профили пользователей
- Редактирование профиля
- Загрузка аватара в Supabase Storage
- Задания сохраняются в Supabase
- Отклики сохраняются в Supabase
- Демо-чат сохраняет сообщения в Supabase
- Отзывы и рейтинг сохраняются в Supabase
- Готовность к деплою на Vercel

## 1. Создать Supabase проект

1. Зайди в Supabase.
2. New project.
3. Создай проект.
4. Открой SQL Editor.
5. Вставь файл `supabase/schema.sql`.
6. Нажми Run.

## 2. Получить ключи

Supabase Dashboard -> Project Settings -> API:

- Project URL
- anon public key

## 3. Настроить локально

Скопируй `.env.example` в `.env`:

```bash
cp .env.example .env
```

Заполни:

```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 4. Запустить локально

```bash
npm install
npm run dev
```

Обычно сайт откроется на:

```bash
http://localhost:5173
```

## 5. Деплой на Vercel

1. Загрузить проект в GitHub.
2. Vercel -> Add New Project.
3. Выбрать репозиторий.
4. Framework: Vite.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Добавить Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
8. Deploy.

## Важно для быстрого теста

Supabase Auth по умолчанию может требовать подтверждение email. Для быстрого MVP можно временно отключить:

Authentication -> Providers -> Email -> Confirm email = OFF

Позже для продакшена лучше включить подтверждение email или телефон/SMS.
