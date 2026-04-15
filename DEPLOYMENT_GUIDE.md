# ToolVibe E-Commerce - Полное руководство развертывания

## 📋 Архитектура проекта

### Backend (FastAPI)
- **Порт**: 3001
- **БД**: SQLite (shop.db)
- **Таблицы**: users, products, categories, cart, orders, order_items
- **Auth**: JWT + Bcrypt

### Frontend
- **Страницы**: page1.html (главная), page2.html (каталог), page3.html (инфо)
- **Стиль**: Tailwind CSS + Custom CSS
- **API Client**: Vanilla JavaScript (fetch)

---

## 🛠️ Локальный запуск

```bash
# Способ 1: Одной командой (Windows)
.\START_ALL.bat

# Способ 2: Через PowerShell
& D:/ToolVepe2/backend/venv/Scripts/Activate.ps1
cd backend
python -m uvicorn main:app --reload --port 3001

# Фронтенд (откройте в браузере)
# Локально: http://localhost:8000/2times/page1.html
# Или просто откройте page1.html в браузере
```

---

## 🌐 Развертывание онлайн

### Вариант 1: Railway.app (Рекомендуется)

1. **Создать аккаунт** на https://railway.app
2. **Подключить GitHub** (если код там)
3. **Создать проект**:
   - Add service → GitHub repo
   - Выбрать ветку с кодом
4. **Переменные окружения**:
   ```
   DATABASE_URL=sqlite:///shop.db
   SECRET_KEY=your-production-secret-key
   ```
5. **Команда запуска**:
   ```
   uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

### Вариант 2: Render.com

1. Зарегистрироваться на https://render.com
2. New+ → Web Service
3. Выбрать GitHub repo
4. **Build command**: `pip install -r requirements.txt`
5. **Start command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Вариант 3: Heroku (deprecated но может работать)

```bash
# Установить Heroku CLI
# heroku login
# heroku create your-app-name
# git push heroku main
```

---

## 📦 requirements.txt для онлайн

```
fastapi==0.109.0
uvicorn==0.27.0
bcrypt==4.1.1
PyJWT==2.10.1
python-multipart==0.0.6
```

---

## 🗄️ Структура БД

### products (Товары)
```
id, name, description, price, category_id, image_url, stock, created_at
```

### categories (Категории)
```
id, name, description
```

### cart (Корзина)
```
id, user_id, product_id, quantity, added_at
```

### orders (Заказы)
```
id, user_id, total_price, status, created_at
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/register` - Регистрация
- `POST /api/login` - Вход

### Products
- `GET /api/products` - Все товары
- `GET /api/products/{id}` - Конкретный товар
- `GET /api/categories` - Все категории

### Cart
- `POST /api/cart` - Добавить в корзину
- `GET /api/cart/{user_id}` - Получить корзину
- `DELETE /api/cart/{user_id}/{product_id}` - Удалить из корзины

### Orders
- `POST /api/orders` - Создать заказ
- `GET /api/orders/{user_id}` - История заказов

---

## 💳 Payment Integration (для будущего)

Рекомендуемые сервисы:
- **Stripe** - Международные платежи
- **Yandex.Kassa** - РФ
- **PayPal** - Универсальный

---

## 📱 Фронтенд улучшения нужны:

1. **Страница каталога** - list товаров с фильтрацией
2. **Карточка товара** - детали и "Добавить в корзину"
3. **Корзина** - редактирование количества
4. **Оформление** - заполнение адреса доставки
5. **История заказов** - просмотр прошлых покупок

---

## 🚀 Миграция на онлайн сервер

1. Push код на GitHub
2. Создать проект на Railway/Render
3. Настроить domain (CNAME record)
4. Обновить API_URL в JavaScript:
   ```javascript
   const API_URL = "https://your-backend.railway.app"
   ```
5. Развернуть фронтенд на:
   - Vercel (React-like)
   - Netlify (static)
   - GitHub Pages (static)

---

## 🔒 Security для production

1. **HTTPS везде** ✅
2. **SECRET_KEY** - сложный пароль
3. **CORS** - только твой домен
4. **Rate limiting** - защита от спама
5. **SQL Injection** - параметризованные запросы ✅
6. **CSRF** - токены при необходимости

---

## 📊 Пример добавления товара (через API)

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новая дрель",
    "description": "Мощная дрель",
    "price": 5000,
    "category_id": 1,
    "stock": 10
  }'
```

---

**Готово! Твой магазин полностью функционален! 🎉**
