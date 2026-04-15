from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import bcrypt
import jwt
from datetime import datetime, timedelta
from pathlib import Path
import json

DB_PATH = Path(__file__).parent / "shop.db"
SECRET_KEY = "your-secret-key-change-in-production-12345"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(
    title="ToolVibe E-Commerce API",
    description="Full e-commerce backend",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category_id INTEGER NOT NULL,
            image_url TEXT,
            stock INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    """)
    
    test_email = "danilodrobotun@gmail.com"
    test_password = "7878tata9898"
    hashed = bcrypt.hashpw(test_password.encode(), bcrypt.gensalt())
    
    try:
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (test_email, hashed)
        )
        print(f"✓ Test user created: {test_email}")
    except sqlite3.IntegrityError:
        print(f"✓ Test user already exists")
    
    categories = [
        ("Дрели", "Электрические дрели и аккумуляторные дрели"),
        ("Пилы", "Циркулярные пилы и электролобзики"),
        ("Болгарки", "Углошлифовальные машины"),
        ("Перфораторы", "Электрические перфораторы"),
    ]
    
    for cat_name, cat_desc in categories:
        try:
            cursor.execute(
                "INSERT INTO categories (name, description) VALUES (?, ?)",
                (cat_name, cat_desc)
            )
        except sqlite3.IntegrityError:
            pass
    
    products = [
        (1, "Дрель BOSCH GSB 13 RE", "Мощная дрель для домашних работ", 3500, "https://via.placeholder.com/300?text=Drill+1", 15),
        (1, "Аккумуляторная дрель DeWALT DCD771C2", "Компактная беспроводная дрель", 4200, "https://via.placeholder.com/300?text=Drill+2", 12),
        (2, "Циркулярная пила MAKITA CS7500", "Профессиональная пила", 8500, "https://via.placeholder.com/300?text=Saw+1", 8),
        (2, "Электролобзик FESTOOL PS 420", "Точная работа и удобство", 9200, "https://via.placeholder.com/300?text=Saw+2", 5),
        (3, "Болгарка METABO W 750-125", "Универсальный инструмент", 2800, "https://via.placeholder.com/300?text=Grinder+1", 20),
        (4, "Перфоратор HILTI TE 3000-AVR", "Мощный профессиональный инструмент", 12500, "https://via.placeholder.com/300?text=Hammer+1", 3),
    ]
    
    for cat_id, name, desc, price, image, stock in products:
        try:
            cursor.execute(
                "INSERT INTO products (category_id, name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)",
                (cat_id, name, desc, price, image, stock)
            )
        except sqlite3.IntegrityError:
            pass
    
    conn.commit()
    conn.close()

def hash_pwd(pwd: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd.encode(), salt)
    return hashed.decode()

def verify_pwd(pwd: str, hashed: str) -> bool:
    try:
        if isinstance(hashed, str):
            hashed = hashed.encode()
        return bcrypt.checkpw(pwd.encode(), hashed)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def make_token(user_id: int, email: str):
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_user(email: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    return user

def get_user_by_id(user_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT id, email FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    return user

@app.on_event("startup")
async def startup():
    init_db()
    print("\n✓ ToolVibe E-Commerce Backend Started!")
    print("✓ API docs: http://localhost:3001/docs")
    print("✓ Test user: danilodrobotun@gmail.com / 7878tata9898\n")

@app.get("/api/health")
async def health():
    return {
        "status": "online",
        "service": "ToolVibe API",
        "version": "2.0.0"
    }

@app.post("/api/register")
async def register(request: dict):
    email = request.get("email", "").strip().lower()
    password = request.get("password", "").strip()
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password too short (min 6)")
    
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed = hash_pwd(password)
    try:
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, hashed)
        )
        conn.commit()
        user_id = cursor.lastrowid
        
        cursor.execute("SELECT id, email, created_at FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        token = make_token(user_id, email)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "created_at": user["created_at"]
            }
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/login")
async def login(request: dict):
    email = request.get("email", "").strip().lower()
    password = request.get("password", "").strip()
    
    print(f"Login attempt: {email}")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    user = get_user(email)
    
    if not user:
        print(f"User not found: {email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    pwd_valid = verify_pwd(password, user["password"])
    print(f"Password valid: {pwd_valid}")
    
    if not pwd_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = make_token(user["id"], user["email"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "created_at": user["created_at"]
        }
    }

@app.get("/api/products")
async def get_products(category_id: int = None):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if category_id:
        cursor.execute("""
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            WHERE p.category_id = ?
        """, (category_id,))
    else:
        cursor.execute("""
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id
        """)
    
    products = cursor.fetchall()
    conn.close()
    
    return [dict(p) for p in products]

@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT p.*, c.name as category_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
    """, (product_id,))
    
    product = cursor.fetchone()
    conn.close()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return dict(product)

@app.get("/api/categories")
async def get_categories():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    conn.close()
    
    return [dict(c) for c in categories]

@app.post("/api/cart")
async def add_to_cart(request: dict):
    user_id = request.get("user_id")
    product_id = request.get("product_id")
    quantity = request.get("quantity", 1)
    
    if not user_id or not product_id:
        raise HTTPException(status_code=400, detail="Missing user_id or product_id")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")
    
    cursor.execute(
        "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
        (user_id, product_id)
    )
    existing = cursor.fetchone()
    
    if existing:
        cursor.execute(
            "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
            (quantity, user_id, product_id)
        )
    else:
        cursor.execute(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
            (user_id, product_id, quantity)
        )
    
    conn.commit()
    conn.close()
    
    return {"message": "Product added to cart"}

@app.get("/api/cart/{user_id}")
async def get_cart(user_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT c.*, p.name, p.price, p.image_url 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    """, (user_id,))
    
    items = cursor.fetchall()
    conn.close()
    
    return [dict(item) for item in items]

@app.delete("/api/cart/{user_id}/{product_id}")
async def remove_from_cart(user_id: int, product_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
        (user_id, product_id)
    )
    
    conn.commit()
    conn.close()
    
    return {"message": "Product removed from cart"}

@app.post("/api/orders")
async def create_order(request: dict):
    user_id = request.get("user_id")
    items = request.get("items", [])
    
    if not user_id or not items:
        raise HTTPException(status_code=400, detail="Missing user_id or items")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    total_price = 0
    for item in items:
        product_id = item.get("product_id")
        quantity = item.get("quantity", 1)
        
        cursor.execute("SELECT price FROM products WHERE id = ?", (product_id,))
        product = cursor.fetchone()
        if not product:
            conn.close()
            raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
        
        total_price += product[0] * quantity
    
    cursor.execute(
        "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
        (user_id, total_price)
    )
    order_id = cursor.lastrowid
    
    for item in items:
        cursor.execute(
            "SELECT price FROM products WHERE id = ?",
            (item.get("product_id"),)
        )
        price = cursor.fetchone()[0]
        
        cursor.execute(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
            (order_id, item.get("product_id"), item.get("quantity", 1), price)
        )
        
        cursor.execute(
            "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
            (user_id, item.get("product_id"))
        )
    
    conn.commit()
    conn.close()
    
    return {
        "order_id": order_id,
        "total_price": total_price,
        "status": "pending",
        "message": "Order created successfully"
    }

@app.get("/api/orders/{user_id}")
async def get_user_orders(user_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    """, (user_id,))
    
    orders = cursor.fetchall()
    conn.close()
    
    return [dict(o) for o in orders]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3001,
        reload=True
    )

