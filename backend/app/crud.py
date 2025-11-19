# X_project/backend/app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

# Configuração de hash de senha (a mesma que você já deve ter)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- FUNÇÕES CRUD EXISTENTES (USER) ---

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    # Pode ser usado para login e busca JWT
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password,
        avatar_url=f"https://api.dicebear.com/7.x/pixel-art/svg?seed={user.username}" # Exemplo de avatar
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_password(db: Session, user: models.User, new_hashed_password: str):
    user.hashed_password = new_hashed_password
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# --- NOVAS FUNÇÕES CRUD (ITEM) ---

def get_items(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    """Retorna todos os itens pertencentes a um ID de usuário específico."""
    return db.query(models.Item).filter(models.Item.owner_id == owner_id).offset(skip).limit(limit).all()

def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    """Cria um novo item no banco de dados, associado ao user_id."""
    # Cria uma instância do modelo Item, vinculando o owner_id
    db_item = models.Item(**item.model_dump(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# --- OUTRAS FUNÇÕES CRUD (ITEM) ---

def get_item(db: Session, item_id: int):
    """Busca um item pelo ID."""
    return db.query(models.Item).filter(models.Item.id == item_id).first()

def delete_item(db: Session, item_id: int):
    """Deleta um item pelo ID e retorna o item deletado."""
    db_item = get_item(db, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item