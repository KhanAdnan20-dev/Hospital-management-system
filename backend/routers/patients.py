from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/patients", tags=["patients"])


@router.post("/", response_model=schemas.PatientRead, status_code=status.HTTP_201_CREATED)
def create_patient(patient_in: schemas.PatientCreate, db: Session = Depends(get_db)):
    patient = models.Patient(**patient_in.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("/", response_model=list[schemas.PatientRead])
def read_patients(db: Session = Depends(get_db)):
    return db.query(models.Patient).all()


@router.get("/{p_id}", response_model=schemas.PatientRead)
def read_patient(p_id: int, db: Session = Depends(get_db)):
    patient = db.get(models.Patient, p_id)
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    return patient


@router.put("/{p_id}", response_model=schemas.PatientRead)
def update_patient(p_id: int, patient_in: schemas.PatientCreate, db: Session = Depends(get_db)):
    patient = db.get(models.Patient, p_id)
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    for field, value in patient_in.model_dump().items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)
    return patient


@router.delete("/{p_id}")
def delete_patient(p_id: int, db: Session = Depends(get_db)):
    patient = db.get(models.Patient, p_id)
    if patient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    db.delete(patient)
    db.commit()
    return {"detail": "Patient deleted successfully"}
