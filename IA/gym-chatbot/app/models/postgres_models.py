from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.postgresql import Base

class User(Base):
    """Modèle pour la table 'users'"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    firstname = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True, nullable=False)
    password = Column(String)
    account_locked = Column(Boolean, default=False)
    enabled = Column(Boolean, default=True)
    created_date = Column(DateTime, default=datetime.utcnow)
    modified_date = Column(DateTime, default=datetime.utcnow)
    
    client = relationship("ClientProfile", back_populates="user", uselist=False)

    def to_context_string(self):
        context = f"Utilisateur: {self.firstname} {self.lastname}"
        if self.client:
            context += f"\nProfil Physique: Age {self.client.age}, Poids {self.client.poids}kg, Taille {self.client.taille}cm"
            context += f"\nObjectif: {self.client.but}"
            context += f"\nNiveau: {self.client.niveau}"
            if self.client.club:
                context += f"\nSalle de sport: {self.client.club.club_name} ({self.client.club.localisation})"
        return context

class ClubProfile(Base):
    """Modèle pour la table 'club_profiles'"""
    __tablename__ = "club_profiles"

    id = Column(Integer, primary_key=True)
    club_name = Column(String) # Mapped from clubName
    localisation = Column(String)
    capacity = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class ClientProfile(Base):
    """Modèle pour la table 'client_profiles'"""
    __tablename__ = "client_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    age = Column(Integer)
    poids = Column(Float)
    taille = Column(Float)
    but = Column(String)
    niveau = Column(String)
    club_id = Column(Integer, ForeignKey("club_profiles.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="client")
    club = relationship("ClubProfile")
