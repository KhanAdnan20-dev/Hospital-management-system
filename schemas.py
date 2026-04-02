from typing import Optional

from pydantic import BaseModel, ConfigDict

from models import GenderEnum, RoomStatusEnum


class PatientCreate(BaseModel):
    name: str
    age: int
    gender: GenderEnum
    diagnosis: Optional[str] = None
    doctor_id: Optional[int] = None
    room_id: Optional[int] = None


class PatientRead(PatientCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class DoctorCreate(BaseModel):
    name: str
    specialty: str


class DoctorRead(DoctorCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class RoomCreate(BaseModel):
    room_number: str
    room_type: str
    status: RoomStatusEnum = RoomStatusEnum.available


class RoomRead(RoomCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
