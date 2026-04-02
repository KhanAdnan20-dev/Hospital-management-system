import { useEffect, useState } from "react";

import { createPatient, getPatients } from "../api";

const initialFormState = {
  name: "",
  dob: "",
  age: "",
  gender: "",
  mob_no: "",
  room_id: "",
};

export default function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setError("");
        const data = await getPatients();
        setPatients(data);
      } catch (requestError) {
        setError("Unable to load patients. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        room_id: Number(formData.room_id),
      };

      await createPatient(payload);
      const data = await getPatients();
      setPatients(data);
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (requestError) {
      setError("Unable to create the patient. Please check the form and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Hospital Management</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Patient Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">View admitted patients and register new entries.</p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Add Patient
          </button>
        </div>

        <div className="p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center text-slate-500">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center text-slate-500">
              No patients found. Add the first patient to get started.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">DOB</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Age</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {patients.map((patient) => (
                    <tr key={patient.p_id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-700">{patient.p_id}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{patient.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {patient.dob ? new Date(patient.dob).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{patient.age}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{patient.gender}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{patient.mob_no}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{patient.room_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Add New Patient</h2>
                <p className="text-sm text-slate-500">Enter the patient details below.</p>
              </div>
              <button type="button" onClick={closeModal} className="text-2xl leading-none text-slate-400 hover:text-slate-700">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 p-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Name
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-cyan-600"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Date of Birth
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-cyan-600"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Age
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-cyan-600"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Gender
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-cyan-600"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Mobile Number
                <input
                  name="mob_no"
                  value={formData.mob_no}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-cyan-600"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Room ID
                <input
                  type="number"
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleChange}
                  required
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-cyan-600"
                />
              </label>

              <div className="flex gap-3 sm:col-span-2 sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
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
