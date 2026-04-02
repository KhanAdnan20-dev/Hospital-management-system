from typing import Optional

from pydantic import BaseModel, ConfigDict

from models import GenderEnum, RoomStatusEnum


class ORMReadModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PatientCreate(BaseModel):
    name: str
    age: int
    gender: GenderEnum
    diagnosis: Optional[str] = None
    doctor_id: Optional[int] = None
    room_id: Optional[int] = None


class PatientRead(PatientCreate, ORMReadModel):
    id: int


class DoctorCreate(BaseModel):
    name: str
    specialty: str


class DoctorRead(DoctorCreate, ORMReadModel):
    id: int


class RoomCreate(BaseModel):
    room_number: str
    room_type: str
    status: RoomStatusEnum = RoomStatusEnum.available


class RoomRead(RoomCreate, ORMReadModel):
    id: int
