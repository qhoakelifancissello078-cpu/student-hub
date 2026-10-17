
import { useEffect, useState } from 'react'
import './App.css'

const initialStudents = [
  { id: '901020401', name: 'Thabo Mokoena', age: 22, email: 'thabo.mokoena@gmail.com', course: 'Business Information Technology', year: 'Year 2', status: 'Active', initials: 'TM' },
  { id: '901020402', name: 'Lerato Ndlovu', age: 21, email: 'lerato.ndlovu@gmail.com', course: 'Information Technology', year: 'Year 2', status: 'Active', initials: 'LN' },
  { id: '901020403', name: 'Mpho Rantso', age: 20, email: 'mpho.rantso@gmail.com', course: 'Computer Science', year: 'Year 1', status: 'Pending', initials: 'MR' },
  { id: '901020404', name: 'Palesa Thabane', age: 23, email: 'palesa.thabane@gmail.com', course: 'Business Information Technology', year: 'Year 3', status: 'Active', initials: 'PT' },
]

const emptyForm = {
  id: '',
  name: '',
  age: '',
  email: '',
  course: '',
  year: 'Year 1',
  status: 'Active',
}

const STORAGE_KEY = 'student-hub-records'

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (error) {
    console.error('Could not load student records:', error)
  }
  return initialStudents
}

function App() {
  const [students, setStudents] = useState(loadStudents)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
    } catch (error) {
      console.error('Could not save student records:', error)
    }
  }, [students])

  const activeCount = students.filter(
    (student) => student.status === 'Active'
  ).length

  const featuredStudent = students[0]

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.trim().toLowerCase()

    const matchesSearch =
      student.name.toLowerCase().includes(query) ||
      student.id.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query)

    const matchesStatus =
      statusFilter === 'All' || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function handleInputChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setFormError('')
  }

  function openAddModal() {
    setEditingStudentId(null)
    setFormData(emptyForm)
    setFormError('')
    setIsModalOpen(true)
  }

  function openEditModal(student) {
    setEditingStudentId(student.id)
    setFormData({
      id: student.id,
      name: student.name,
      age: String(student.age),
      email: student.email,
      course: student.course,
      year: student.year,
      status: student.status,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingStudentId(null)
    setFormError('')
  }

  function handleSaveStudent(event) {
    event.preventDefault()

    const studentId = formData.id.trim()
    const fullName = formData.name.trim()
    const email = formData.email.trim()
    const course = formData.course.trim()
    const age = Number(formData.age)

    if (!studentId || !fullName || !formData.age || !email || !course) {
      setFormError('Please complete all required fields.')
      return
    }

    if (!/^\d{9}$/.test(studentId)) {
      setFormError('Student ID must contain exactly 9 digits.')
      return
    }

    const duplicateId = students.some(
      (student) =>
        student.id === studentId && student.id !== editingStudentId
    )

    if (duplicateId) {
      setFormError('This student ID already exists.')
      return
    }

    if (!Number.isInteger(age) || age < 16 || age > 100) {
      setFormError('Enter a whole-number age between 16 and 100.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Enter a valid email address.')
      return
    }

    const initials = fullName
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const savedStudent = {
      id: studentId,
      name: fullName,
      age,
      email,
      course,
      year: formData.year,
      status: formData.status,
      initials,
    }

    if (editingStudentId !== null) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editingStudentId ? savedStudent : student
        )
      )
    } else {
      setStudents((previous) => [...previous, savedStudent])
    }

    closeModal()
  }

  function handleDeleteStudent(student) {
    const confirmed = window.confirm(
      `Delete ${student.name}'s record? This action cannot be undone.`
    )

    if (!confirmed) return

    setStudents((previous) =>
      previous.filter((item) => item.id !== student.id)
    )
  }

  return (
    <main className="student-hub">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SH</div>
          <div>
            <h2>Student Hub</h2>
            <p>STUDENT DIRECTORY</p>
          </div>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          <a className="nav-link active" href="#overview">
            <span>▦</span> Overview
          </a>
          <a className="nav-link" href="#directory">
            <span>♙</span> Student directory
          </a>
        </nav>

        <div className="sidebar-note">
          <span className="note-line" />
          <p>
            Every student has a story. Keep each record accurate and up to date.
          </p>
        </div>

        <div className="sidebar-footer">
          <span className="profile-avatar">SH</span>
          <div>
            <strong>Student Records</strong>
            <p>Administration</p>
          </div>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <p>
            Campus Journal <span>/</span> Student Records
          </p>
          <span className="academic-tag">ACADEMIC DIRECTORY</span>
        </header>

        <section className="page-heading" id="overview">
          <div>
            <p className="eyebrow">THE STUDENT REGISTER</p>
            <h1>A place for every student.</h1>
            <p className="page-description">
              Manage student information in one organised directory.
            </p>
          </div>

          <button className="primary-button" onClick={openAddModal}>
            <span>＋</span> Add student
          </button>
        </section>

        <section className="metrics">
          <article className="metric-card">
            <p className="metric-label">TOTAL STUDENTS</p>
            <h2>{String(students.length).padStart(2, '0')}</h2>
            <p className="metric-footnote">Records in the directory</p>
          </article>

          <article className="metric-card">
            <p className="metric-label">ACTIVE STUDENTS</p>
            <h2>{String(activeCount).padStart(2, '0')}</h2>
            <p className="metric-footnote">Currently marked active</p>
          </article>

          <article className="metric-card accent-card">
            <p className="metric-label">RECORD KEEPING</p>
            <h2>Organised.</h2>
            <p className="metric-footnote">Changes save in this browser</p>
          </article>
        </section>

        {featuredStudent && (
          <section className="featured-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">IN THE SPOTLIGHT</p>
                <h2>Featured student</h2>
              </div>
              <span className="record-number">RECORD 01</span>
            </div>

            <article className="featured-card">
              <div className="featured-initials">
                {featuredStudent.initials}
              </div>

              <div className="featured-info">
                <span className="featured-label">STUDENT PROFILE</span>
                <h3>{featuredStudent.name}</h3>
                <p>{featuredStudent.course}</p>

                <div className="featured-details">
                  <span>ID: {featuredStudent.id}</span>
                  <span>{featuredStudent.year}</span>
                  <span>{featuredStudent.age} years old</span>
                </div>
              </div>

              <span
                className={`status-badge ${featuredStudent.status.toLowerCase()}`}
              >
                {featuredStudent.status}
              </span>
            </article>
          </section>
        )}

        <section className="directory-section" id="directory">
          <div className="section-heading directory-heading">
            <div>
              <p className="eyebrow">ALL RECORDS</p>
              <h2>Student directory</h2>
              <p className="section-description">
                Browse student profiles and keep their details current.
              </p>
            </div>

            <span className="record-number">
              {filteredStudents.length} RECORDS SHOWN
            </span>
          </div>

          <div className="directory-tools">
            <input
              className="search-input"
              type="search"
              placeholder="Search name, ID, email or course..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search students"
            />
            <span className="search-count">
              Showing {filteredStudents.length} of {students.length} students
            </span>
          </div>

          <div className="status-filters" aria-label="Filter by student status">
            {['All', 'Active', 'Pending', 'Inactive'].map((status) => (
              <button
                key={status}
                className={`filter-button ${
                  statusFilter === status ? 'selected' : ''
                }`}
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
              >
                {status}
              </button>
            ))}
          </div>

          {filteredStudents.length === 0 ? (
            <div className="no-results">
              <h3>No students found</h3>
              <p>Try another search or choose a different status filter.</p>
            </div>
          ) : (
            <div className="student-grid">
              {filteredStudents.map((student) => (
                <article className="student-card" key={student.id}>
                  <div className="student-card-top">
                    <div className="student-avatar">{student.initials}</div>
                    <span
                      className={`status-badge ${student.status.toLowerCase()}`}
                    >
                      {student.status}
                    </span>
                  </div>

                  <h3>{student.name}</h3>
                  <p className="student-course">{student.course}</p>

                  <div className="student-card-details">
                    <p>
                      <span>Student ID</span>
                      <strong>{student.id}</strong>
                    </p>
                    <p>
                      <span>Email</span>
                      <strong>{student.email}</strong>
                    </p>
                    <p>
                      <span>Age</span>
                      <strong>{student.age}</strong>
                    </p>
                    <p>
                      <span>Study year</span>
                      <strong>{student.year}</strong>
                    </p>
                  </div>

                  <div className="record-actions">
                    <button
                      type="button"
                      className="edit-record-button"
                      onClick={() => openEditModal(student)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-record-button"
                      onClick={() => handleDeleteStudent(student)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span>STUDENT HUB</span>
          <span>Accurate records. Better organisation.</span>
        </footer>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <section
            className="student-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">
                  {editingStudentId !== null ? 'UPDATE RECORD' : 'NEW RECORD'}
                </p>
                <h2 id="student-modal-title">
                  {editingStudentId !== null ? 'Edit student' : 'Add a student'}
                </h2>
                <p>
                  {editingStudentId !== null
                    ? 'Update the student details below.'
                    : 'Enter the student details to add them to the directory.'}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveStudent}>
              <div className="form-grid">
                <label>
                  Student ID *
                  <input
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="e.g. 901020405"
                    inputMode="numeric"
                    maxLength={9}
                    required
                  />
                </label>

                <label>
                  Full name *
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </label>

                <label>
                  Age *
                  <input
                    name="age"
                    type="number"
                    min="16"
                    max="100"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    required
                  />
                </label>

                <label>
                  Study year *
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  >
                    <option>Year 1</option>
                    <option>Year 2</option>
                    <option>Year 3</option>
                    <option>Year 4</option>
                  </select>
                </label>

                <label className="full-width">
                  Email address *
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@gmail.com"
                    required
                  />
                </label>

                <label className="full-width">
                  Course of study *
                  <input
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    placeholder="Enter course name"
                    required
                  />
                </label>

                <label className="full-width">
                  Enrollment status *
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </div>

              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingStudentId !== null ? 'Save changes' : 'Save student'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
