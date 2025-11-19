# X/backend/app/models.py (CÓDIGO CORRIGIDO)
from sqlalchemy import Column, Integer, String, ForeignKey # Adicionado ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship # Adicionado relationship

# Configuração do Banco de Dados
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependência para obter a sessão do DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- MODELO ITEM/TAREFA (DEVE SER DEFINIDO ANTES DE SER REFERENCIADO PELO USER) ---
class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    # Chave estrangeira ligando ao id da tabela 'users'
    owner_id = Column(Integer, ForeignKey("users.id")) 

    # Define o relacionamento de volta para a tabela User
    owner = relationship("User", back_populates="items")


# --- MODELO DO USUÁRIO (DEFINIÇÃO ÚNICA E COMPLETA) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    avatar_url = Column(String, default="default_avatar.png")

    # Relacionamento para acessar os itens do usuário (MUITOS itens)
    # Deve estar na definição final da classe User.
    items = relationship("Item", back_populates="owner") 

# Cria as tabelas no banco de dados (se não existirem)
Base.metadata.create_all(bind=engine)