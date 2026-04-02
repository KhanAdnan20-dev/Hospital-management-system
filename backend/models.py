from sqlalchemy import Boolean, Column, Date, Float, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from .database import Base

consultations = Table(
    "consultations",
    Base.metadata,
    Column("p_id", Integer, ForeignKey("patients.p_id"), primary_key=True),
    Column("e_id", Integer, ForeignKey("doctors.e_id"), primary_key=True),
)


class Employee(Base):
    __tablename__ = "employees"

    e_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    salary = Column(Float, nullable=False)
    gender = Column(String(20), nullable=False)
    mob_no = Column(String(20), nullable=False)
    state = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    pin_no = Column(String(20), nullable=False)
    employee_type = Column(String(50), nullable=False)

    __mapper_args__ = {
        "polymorphic_on": employee_type,
        "polymorphic_identity": "employee",
    }


class Doctor(Employee):
    __tablename__ = "doctors"

    e_id = Column(Integer, ForeignKey("employees.e_id"), primary_key=True)
    dept = Column(String(100), nullable=False)
    qualification = Column(String(150), nullable=False)

    patients = relationship("Patient", secondary=consultations, back_populates="doctors")

    __mapper_args__ = {"polymorphic_identity": "doctor"}


class Nurse(Employee):
    __tablename__ = "nurses"

    e_id = Column(Integer, ForeignKey("employees.e_id"), primary_key=True)

    __mapper_args__ = {"polymorphic_identity": "nurse"}


class Receptionist(Employee):
    __tablename__ = "receptionists"

    e_id = Column(Integer, ForeignKey("employees.e_id"), primary_key=True)

    records = relationship("Record", back_populates="receptionist")

    __mapper_args__ = {"polymorphic_identity": "receptionist"}


class Room(Base):
    __tablename__ = "rooms"

    r_id = Column(Integer, primary_key=True, index=True)
    type = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    availability = Column(Boolean, nullable=False, default=True)

    patients = relationship("Patient", back_populates="room")
    test_reports = relationship("TestReport", back_populates="room")


class Patient(Base):
    __tablename__ = "patients"

    p_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    mob_no = Column(String(20), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.r_id"), nullable=False)

    room = relationship("Room", back_populates="patients")
    doctors = relationship("Doctor", secondary=consultations, back_populates="patients")
    test_reports = relationship("TestReport", back_populates="patient")
    bills = relationship("Bill", back_populates="patient")


class TestReport(Base):
    __tablename__ = "test_reports"

    report_id = Column(Integer, primary_key=True, index=True)
    test_type = Column(String(100), nullable=False)
    result = Column(String(255), nullable=False)
    p_id = Column(Integer, ForeignKey("patients.p_id"), nullable=False)
    r_id = Column(Integer, ForeignKey("rooms.r_id"), nullable=False)

    patient = relationship("Patient", back_populates="test_reports")
    room = relationship("Room", back_populates="test_reports")


class Bill(Base):
    __tablename__ = "bills"

    b_id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    p_id = Column(Integer, ForeignKey("patients.p_id"), nullable=False)

    patient = relationship("Patient", back_populates="bills")


class Record(Base):
    __tablename__ = "records"

    record_no = Column(Integer, primary_key=True, index=True)
    app_no = Column(Integer, nullable=False)
    receptionist_id = Column(Integer, ForeignKey("receptionists.e_id"), nullable=False)

    receptionist = relationship("Receptionist", back_populates="records")
