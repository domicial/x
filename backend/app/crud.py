from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password,
        avatar_url=f"https://api.dicebear.com/7.x/pixel-art/svg?seed={user.username}"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_initial_user(db: Session):
    """Creates the initial admin user if it doesn't exist."""
    existing_user = get_user_by_username(db, username="admin")
    if existing_user:
        return existing_user
    
    admin_user = schemas.UserCreate(
        username="admin",
        email="admin@example.com",
        password="senha123"
    )
    return create_user(db, admin_user)

def update_user_password(db: Session, user: models.User, new_hashed_password: str):
    user.hashed_password = new_hashed_password
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_items(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    """Returns all items owned by a specific user."""
    return db.query(models.Item).filter(models.Item.owner_id == owner_id).offset(skip).limit(limit).all()

def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    """Creates a new item in the database associated with user_id."""
    db_item = models.Item(**item.model_dump(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_item(db: Session, item_id: int):
    """Fetches an item by ID."""
    return db.query(models.Item).filter(models.Item.id == item_id).first()

def delete_item(db: Session, item_id: int):
    """Deletes an item by ID."""
    db_item = get_item(db, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item
