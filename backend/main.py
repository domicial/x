# X_project/backend/main.py (CÓDIGO COMPLETO E CORRIGIDO)

from fastapi import FastAPI, Depends, HTTPException, status, Response # Adicionado Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.models import get_db # get_db é uma dependência, não precisa de Base ou engine aqui
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordBearer # Necessário para get_current_user
# from app.auth import authenticate_user, create_access_token # Assumindo que você tem funções de autenticação

# --- Configuração Inicial ---
load_dotenv()
models.Base.metadata.create_all(bind=models.engine) # Garante que as tabelas são criadas na inicialização

# Configuração da Aplicação
app = FastAPI() # INSTÂNCIA PRINCIPAL DO FASTAPI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Configurações JWT ---
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 30)
RESET_TOKEN_EXPIRE_MINUTES = 15 

# --- Configuração CORS ---
origins = [
    "http://localhost:5173", # Porta padrão do Vite
    "http://localhost:5174",
    "http://localhost:5175", # Porta usada se as anteriores estiverem ocupadas
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Funções JWT (Manutenção e Reset) ---
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    # Função para o token de LOGIN
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_reset_token(email: str) -> str:
    """Cria um token JWT para reset de senha com tempo de vida curto."""
    expire = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire, "type": "reset"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Dependência de Segurança ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Verifica o token JWT e retorna o usuário logado."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
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


# --- ROTAS PÚBLICAS ---
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API X"}

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(request: schemas.UserLogin, db: Session = Depends(get_db)):
    # Simula autenticação usando a função (ajustar conforme sua implementação de auth.py)
    user = crud.get_user_by_username(db, username=request.username)
    
    if not user or not crud.verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nome de usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# -----------------------------------------------------------
# ROTAS DE REDEFINIÇÃO DE SENHA
# -----------------------------------------------------------

@app.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    """Inicia o processo de redefinição de senha."""
    user = crud.get_user_by_email(db, email=request.email)
    
    if not user:
        return {"message": "Se o email estiver registrado, você receberá um link de redefinição."}

    # 1. Gera o token de redefinição
    reset_token = create_reset_token(user.email)
    
    # 2. SIMULAÇÃO DE E-MAIL
    reset_url = f"http://localhost:5175/reset-password?token={reset_token}"
    
    print("-" * 50)
    print(f"SIMULAÇÃO DE EMAIL - LINK DE REDEFINIÇÃO PARA {user.email}:")
    print(reset_url)
    print("-" * 50)

    return {"message": "Se o email estiver registrado, você receberá um link de redefinição."}

@app.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(data: schemas.PasswordReset, db: Session = Depends(get_db)):
    """Redefine a senha usando o token recebido."""
    try:
        # 1. Decodifica o token
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")

        # 2. Valida o token e o tipo
        if email is None or token_type != "reset":
            raise JWTError

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido ou expirado. Por favor, solicite uma nova redefinição.",
        )

    # 3. Busca o usuário
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")

    # 4. Atualiza a senha
    new_hashed_password = crud.get_password_hash(data.new_password)
    if crud.update_user_password(db, user, new_hashed_password):
        return {"message": "Senha redefinida com sucesso! Você pode fazer login agora."}
    
    # 5. Caso algo falhe na atualização
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Falha ao atualizar a senha.")


# -----------------------------------------------------------
# ROTAS PROTEGIDAS (USUÁRIO E ITENS)
# -----------------------------------------------------------

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Retorna os dados do usuário atualmente logado."""
    return current_user

@app.post("/items/", response_model=schemas.Item, status_code=status.HTTP_201_CREATED)
def create_item_for_current_user(
    item: schemas.ItemCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Cria um novo item e o associa ao usuário logado."""
    return crud.create_user_item(db=db, item=item, user_id=current_user.id)

# X_project/backend/main.py

# ... (código existente) ...

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API X"}

@app.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Cria um novo usuário no sistema após verificar se o username/email já existe."""
    
    # 1. Verifica se o username já existe
    db_user_by_username = crud.get_user_by_username(db, username=user.username)
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="Nome de usuário já registrado.")
        
    # 2. Verifica se o email já existe
    db_user_by_email = crud.get_user_by_email(db, email=user.email)
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="E-mail já registrado.")

    # 3. Cria o usuário e retorna o objeto (sem a senha)
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(request: schemas.UserLogin, db: Session = Depends(get_db)):
# ... (restante do código) ...
    """Retorna todos os itens criados pelo usuário logado."""
    items = crud.get_items(db, owner_id=current_user.id)
    return items

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item_for_current_user(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Deleta um item, verificando se ele pertence ao usuário logado."""
    db_item = crud.get_item(db, item_id=item_id)
    
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    
    if db_item.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para deletar este item.")
    
    crud.delete_item(db, item_id=item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# --- Execução do Backend ---
if __name__ == "__main__":
    # Garante que o usuário 'admin' inicial é criado no startup
    with models.SessionLocal() as db:
        crud.create_initial_user(db)
        
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)