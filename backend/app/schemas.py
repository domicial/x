# X_project/backend/app/schemas.py (CÓDIGO CORRIGIDO)
from pydantic import BaseModel, EmailStr # IMPORT EmailStr é NECESSÁRIO

# --- SCHEMAS DE AUTENTICAÇÃO E USUÁRIO ---
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# --- SCHEMAS DE REDEFINIÇÃO DE SENHA ---
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

# --- SCHEMAS DE ITENS (NOVOS) ---

class ItemBase(BaseModel):
    title: str
    description: str | None = None # Opcional

class ItemCreate(ItemBase):
    pass

class Item(ItemBase): # Usado para leitura/retorno de um Item individual
    id: int
    owner_id: int # Quem é o dono do item

    class Config:
        from_attributes = True

# --- SCHEMA DE USUÁRIO (DEFINIÇÃO ÚNICA E ATUALIZADA) ---
# Esta é a definição final da classe User para leitura/retorno da API
class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    avatar_url: str
    # NOVO: Lista de itens que o usuário possui (Relacionamento Um-para-Muitos)
    items: list[Item] = [] 

    class Config:
        from_attributes = True