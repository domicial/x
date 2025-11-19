from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.models import get_db
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer

load_dotenv()
models.Base.metadata.create_all(bind=models.engine)

app = FastAPI(title="X Project API", version="1.0.0")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- JWT Configuration ---
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
RESET_TOKEN_EXPIRE_MINUTES = 15

# --- CORS Configuration ---
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- JWT Functions ---
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Creates a JWT token for login."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_reset_token(email: str) -> str:
    """Creates a JWT token for password reset with short expiration."""
    expire = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire, "type": "reset"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Security Dependency ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Verifies JWT token and returns the logged-in user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
        
    return user

# --- Public Routes ---
@app.get("/")
def read_root():
    """Root endpoint."""
    return {"message": "Welcome to X Project API"}

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(request: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login endpoint that returns access token."""
    user = crud.get_user_by_username(db, username=request.username)
    
    if not user or not crud.verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """User registration endpoint."""
    db_user_by_username = crud.get_user_by_username(db, username=user.username)
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    db_user_by_email = crud.get_user_by_email(db, email=user.email)
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    return crud.create_user(db=db, user=user)

# --- Password Reset Routes ---
@app.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    """Initiates password reset process."""
    user = crud.get_user_by_email(db, email=request.email)
    
    if not user:
        return {"message": "If email is registered, you will receive a password reset link"}

    reset_token = create_reset_token(user.email)
    reset_url = f"http://localhost:5175/reset-password?token={reset_token}"
    
    print("-" * 50)
    print(f"EMAIL SIMULATION - PASSWORD RESET LINK FOR {user.email}:")
    print(reset_url)
    print("-" * 50)

    return {"message": "If email is registered, you will receive a password reset link"}

@app.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(data: schemas.PasswordReset, db: Session = Depends(get_db)):
    """Resets password using reset token."""
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")

        if email is None or token_type != "reset":
            raise JWTError

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token. Please request a new password reset.",
        )

    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    new_hashed_password = crud.get_password_hash(data.new_password)
    if crud.update_user_password(db, user, new_hashed_password):
        return {"message": "Password reset successfully. You can now login"}
    
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update password")

# --- Protected Routes ---
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Returns the currently logged-in user's data."""
    return current_user

@app.post("/items/", response_model=schemas.Item, status_code=status.HTTP_201_CREATED)
def create_item_for_current_user(
    item: schemas.ItemCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Creates a new item for the currently logged-in user."""
    return crud.create_user_item(db=db, item=item, user_id=current_user.id)

@app.get("/items/", response_model=list[schemas.Item])
def get_items_for_current_user(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Returns all items created by the currently logged-in user."""
    items = crud.get_items(db, owner_id=current_user.id)
    return items

@app.get("/items/{item_id}", response_model=schemas.Item)
def get_item_for_current_user(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Returns a specific item if it belongs to the currently logged-in user."""
    db_item = crud.get_item(db, item_id=item_id)
    
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if db_item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to access this item")
    
    return db_item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_for_current_user(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Deletes an item if it belongs to the currently logged-in user."""
    db_item = crud.get_item(db, item_id=item_id)
    
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if db_item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this item")
    
    crud.delete_item(db, item_id=item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# --- Startup ---
if __name__ == "__main__":
    with models.SessionLocal() as db:
        crud.create_initial_user(db)
        
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
