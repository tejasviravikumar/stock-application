from sqlalchemy import Column,Integer,String,Boolean,ForeignKey
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql import text
from .database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer,nullable=False,primary_key=True)
    email = Column(String,nullable=False,unique=True)
    username = Column(String,nullable=False,unique=True)
    password=Column(String,nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),nullable = False,server_default= text(('NOW()')))


# class Stock(Base):
#     __tablename__ = "stock"


class Portfolio(Base):
    __tablename__ = "portfolios"
    portfolio_id = Column(Integer,primary_key=True,nullable=False)
    user_id = Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False)
    name = Column(String,nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),nullable=False,server_default=text("NOW()"))
    owner = relationship("User")
# class Order(Base):
#     __tablename__="order"


# class Transaction(Base):
#     __tablename__="transaction"

    

