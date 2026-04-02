from typing import Optional

from pydantic import BaseModel, ConfigDict


class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
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
    status: str = "available"


class RoomRead(RoomCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
