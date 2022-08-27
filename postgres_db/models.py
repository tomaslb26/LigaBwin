from sqlalchemy import BigInteger, Column, DateTime, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import ForeignKeyConstraint, UniqueConstraint
from sqlalchemy.sql import func

Base = declarative_base()


# ========= nfs_metrics ==================================================


class Games(Base):
    __tablename__ = "games"
    minute = Column(Integer)
    second = Column(Integer)
    teamId = Column(Integer)
    x = Column(Float)
    y = Column(Float)
