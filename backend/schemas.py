from datetime import date

from pydantic import BaseModel, ConfigDict


class PatientBase(BaseModel):
    name: str
    dob: date
    age: int
    gender: str
    mob_no: str
    room_id: int


class PatientCreate(PatientBase):
    pass


class PatientRead(PatientBase):
    p_id: int
    model_config = ConfigDict(from_attributes=True)


class DoctorBase(BaseModel):
    name: str
    salary: float
    gender: str
    mob_no: str
    state: str
    city: str
    pin_no: str
    dept: str
    qualification: str


class DoctorCreate(DoctorBase):
    pass


class DoctorRead(DoctorBase):
    e_id: int
    model_config = ConfigDict(from_attributes=True)


class RoomBase(BaseModel):
    type: str
    capacity: int
    availability: bool


class RoomCreate(RoomBase):
    pass


class RoomRead(RoomBase):
    r_id: int
    model_config = ConfigDict(from_attributes=True)
