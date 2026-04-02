import { useEffect, useMemo, useState } from "react";
import { Edit3, Eye, Plus, Search, Trash2, X } from "lucide-react";

import { createPatient, getPatients } from "../api";

const initialFormState = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  mobile: "",
  roomAssignment: "",
};

function getStatusBadgeClasses(status) {
  switch (status) {
    case "Admitted":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "Discharged":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    case "Critical":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-cyan-50 text-cyan-700 ring-cyan-200";
  }
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function adaptPatientFromApi(patient) {
  const [firstName = "", ...rest] = (patient.name || "").trim().split(/\s+/);

  return {
    id: `P-${patient.p_id}`,
    firstName,
    lastName: rest.join(" "),
    dob: patient.dob,
    age: patient.age,
    gender: patient.gender,
    mobile: patient.mob_no,
    room: patient.room_id,
    status: patient.status || "Admitted",
  };
}

export default function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setError("");
        setIsLoading(true);
        const data = await getPatients();
        setPatients(data.map(adaptPatientFromApi));
      } catch (requestError) {
        setError("Unable to load patients from the server. Please make sure the FastAPI backend is running.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return patient.id.toLowerCase().includes(query) || fullName.includes(query);
    });
  }, [patients, searchQuery]);

  const openModal = () => {
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const nextPatient = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      dob: formData.dob,
      age: new Date().getFullYear() - new Date(formData.dob).getFullYear(),
      gender: formData.gender,
      mob_no: formData.mobile,
      room_id: Number(formData.roomAssignment),
    };

    createPatient(nextPatient)
      .then((createdPatient) => {
        setPatients((current) => [adaptPatientFromApi(createdPatient), ...current]);
        setFormData(initialFormState);
        setIsModalOpen(false);
      })
      .catch(() => {
        setError("Unable to save the patient. Check the backend and try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_42%,_#eef2ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 ring-1 ring-cyan-100">
                HealthNova
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                HealthNova Patient Dashboard
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Monitor patient flow, search records in real time, and manage admissions from a polished clinical control center.
              </p>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add New Patient
            </button>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by patient ID or name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>
          </div>

          {error ? (
            <div className="mx-5 mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mx-6">
              {error}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">DOB</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Age</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Gender</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Room</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {!isLoading && filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="transition hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{patient.id}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{formatDate(patient.dob)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{patient.age}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{patient.gender}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{patient.mobile}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{patient.room}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusBadgeClasses(
                            patient.status,
                          )}`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label={`View ${patient.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label={`Edit ${patient.id}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                            aria-label={`Delete ${patient.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !isLoading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-16 text-center">
                      <div className="mx-auto max-w-md rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12">
                        <p className="text-lg font-semibold text-slate-900">No patients found</p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Try a different search term or add a new patient to populate the table.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-16 text-center text-sm text-slate-500">
                      Loading patients from FastAPI...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Add Patient</h2>
                <p className="mt-1 text-sm text-slate-500">Create a new record for the patient intake flow.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                First Name
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Last Name
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                DOB
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Gender
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Mobile
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Room Assignment
                <input
                  name="roomAssignment"
                  value={formData.roomAssignment}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <div className="flex gap-3 pt-2 sm:col-span-2 sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
                >
                  {isSubmitting ? "Saving..." : "Save Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
