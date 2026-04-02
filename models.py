from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)

    patients = relationship("Patient", back_populates="doctor")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(20), nullable=False, unique=True, index=True)
    room_type = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False, default="available")

    patients = relationship("Patient", back_populates="room")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    diagnosis = Column(String(255), nullable=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)

    doctor = relationship("Doctor", back_populates="patients")
    room = relationship("Room", back_populates="patients")
