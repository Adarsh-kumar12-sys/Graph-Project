

// // src/pages/CourseSchedulerPage.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import CourseInput from '../components/CourseInput';
// import { useAuth } from "../context/AuthContext";

// const TrashIcon = ({ onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="text-gray-500 hover:text-red-500 transition-colors rounded-full p-1 hover:bg-red-100"
//     aria-label="Delete plan"
//   >
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//       <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
//     </svg>
//   </button>
// );

// function CourseSchedulerPage() {
//   const [planName, setPlanName] = useState('');
//   const [courses, setCourses] = useState([{ id: 1, name: '', prerequisites: [''] }]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successResult, setSuccessResult] = useState(null);
//   const [savedPlans, setSavedPlans] = useState([]);
//   const [isPlansLoading, setIsPlansLoading] = useState(true);

//   const API_BASE_URL = 'http://localhost:5000';
//   const { token } = useAuth();

//   const fetchPlans = useCallback(async () => {
//     setIsPlansLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/topo/all`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!response.ok) throw new Error('Failed to fetch plans.');
//       const data = await response.json();
//       setSavedPlans(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsPlansLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (token) fetchPlans();
//   }, [token, fetchPlans]);

//   const handleDeletePlan = async (planId) => {
//     setSavedPlans(current => current.filter(p => p._id !== planId));
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/topo/delete/${planId}`, {
//         method: 'DELETE',
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!response.ok) throw new Error('Failed to delete plan.');
//     } catch (err) {
//       setError(err.message);
//       fetchPlans();
//     }
//   };

//   const handleAddCourse = () => {
//     const newCourse = { id: Date.now(), name: '', prerequisites: [''] };
//     setCourses([...courses, newCourse]);
//   };

//   const handleCourseChange = (id, updatedCourse) => {
//     setCourses(courses.map(c => (c.id === id ? updatedCourse : c)));
//   };

//   const handleCourseRemove = (id) => {
//     if (courses.length > 1) {
//       setCourses(courses.filter(c => c.id !== id));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       setError("Please login to create a course plan.");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     setSuccessResult(null);

//     const allCourseNames = new Set();
//     const prerequisitesList = [];
//     courses.forEach(course => {
//       const courseName = course.name.trim();
//       if (courseName) {
//         allCourseNames.add(courseName);
//         course.prerequisites.forEach(prereq => {
//           const prereqName = prereq.trim();
//           if (prereqName && prereqName !== courseName) {
//             allCourseNames.add(prereqName);
//             prerequisitesList.push([prereqName, courseName]);
//           }
//         });
//       }
//     });

//     const payload = {
//       name: planName.trim(),
//       courses: Array.from(allCourseNames),
//       prerequisites: prerequisitesList,
//     };

//     if (!payload.name || payload.courses.length === 0) {
//       setError("Plan Name and at least one course are required.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/topo/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'An unknown error occurred.');

//       setSuccessResult(data.sortedOrder);
//       fetchPlans();
//       setPlanName('');
//       setCourses([{ id: 1, name: '', prerequisites: [''] }]);

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatPrereqs = (prereqs) => prereqs.map(p => p.join(' → ')).join(', ');
//   const formatResult = (result) => result.join(' → ');

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-xl font-bold text-gray-800">🎓 Course Scheduler</h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

//           {/* Create New Course Plan */}
//           <section className="bg-white p-8 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold text-gray-800 mb-7">Create New Course Plan</h2>

//             <form onSubmit={handleSubmit} className="space-y-7">
//               <div>
//                 <label htmlFor="planName" className="block text-sm font-semibold text-gray-700 mb-1">
//                   Plan Name
//                 </label>
//                 <input
//                   id="planName"
//                   type="text"
//                   value={planName}
//                   onChange={(e) => setPlanName(e.target.value)}
//                   placeholder="e.g., Semester 5 Schedule"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                 />
//               </div>

//               <div className="space-y-6">
//                 {courses.map((course) => (
//                   <CourseInput
//                     key={course.id}
//                     course={course}
//                     onCourseChange={(updatedCourse) => handleCourseChange(course.id, updatedCourse)}
//                     onCourseRemove={() => handleCourseRemove(course.id)}
//                   />
//                 ))}
//               </div>

//               <div className="space-y-4">
//                 {error && (
//                   <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md shadow-sm border border-red-200">
//                     <strong>Error:</strong> {error}
//                   </div>
//                 )}
//                 {successResult && (
//                   <div className="bg-green-100 text-green-700 px-4 py-3 rounded-md shadow-sm border border-green-200">
//                     Suggested Order: <span className="font-mono">{formatResult(successResult)}</span>
//                   </div>
//                 )}

//                 <button
//                   type="button"
//                   onClick={handleAddCourse}
//                   className="w-full justify-center py-2 rounded-md border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
//                 >
//                   + Add Another Course
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold shadow-lg hover:bg-indigo-700 transition disabled:opacity-60"
//                 >
//                   {isLoading ? 'Generating...' : 'Generate Course Sequence'}
//                 </button>
//               </div>
//             </form>
//           </section>

//           {/* Saved Plans Section */}
//           <section className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800">Your Saved Plans</h2>
//             {isPlansLoading ? (
//               <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">Loading plans...</div>
//             ) : savedPlans.length === 0 ? (
//               <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">No saved plans found.</div>
//             ) : (
//               savedPlans.map((plan) => (
//                 <article key={plan._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                   <div className="flex justify-between items-start mb-4">
//                     <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
//                     <TrashIcon onClick={() => handleDeletePlan(plan._id)} />
//                   </div>
//                   <div className="text-sm space-y-1 text-gray-700">
//                     <p>
//                       <strong>Courses:</strong> {plan.courses.join(', ')}
//                     </p>
//                     <p>
//                       <strong>Prerequisites:</strong> {formatPrereqs(plan.prerequisites)}
//                     </p>
//                     <p>
//                       <strong>Suggested Order:</strong>{' '}
//                       <span className="text-indigo-600 font-medium">{formatResult(plan.result)}</span>
//                     </p>
//                   </div>
//                 </article>
//               ))
//             )}
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default CourseSchedulerPage;



import React, { useState, useEffect, useCallback } from 'react';
import CourseInput from '../components/CourseInput';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { FaHome } from "react-icons/fa";


// Inline edit & trash icons
const EditIcon = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded p-1 transition"
    title="Edit Plan"
    aria-label="Edit"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M16.5 3.5a2.121 2.121 0 113 3L7 19H4v-3L16.5 3.5z" />
    </svg>
  </button>
);

const TrashIcon = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 rounded p-1 transition"
    title="Delete Plan"
    aria-label="Delete"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
  </button>
);

function CourseSchedulerPage() {
  const [planName, setPlanName] = useState('');
  const [courses, setCourses] = useState([{ id: 1, name: '', prerequisites: [''] }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [isPlansLoading, setIsPlansLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editPlanId, setEditPlanId] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';
  const { token } = useAuth();

  const fetchPlans = useCallback(async () => {
    setIsPlansLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/topo/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch plans.');
      const data = await response.json();
      setSavedPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPlansLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPlans();
  }, [token, fetchPlans]);

  const handleDeletePlan = async (planId) => {
    setSavedPlans(current => current.filter(p => p._id !== planId));
    try {
      const response = await fetch(`${API_BASE_URL}/api/topo/delete/${planId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to delete plan.');
      toast.success('Plan deleted!');
    } catch (err) {
      setError(err.message);
      fetchPlans();
      toast.error('Failed to delete plan: ' + err.message);
    }
  };

  const handleEditPlan = (planId) => {
    const planToEdit = savedPlans.find(p => p._id === planId);
    if (!planToEdit) return;
    setPlanName(planToEdit.name);
    setCourses(
      planToEdit.courses.map((name, idx) => ({
        id: Date.now() + idx,
        name,
        prerequisites: planToEdit.prerequisites.filter(p => p[1] === name).map(p => p[0]) || ['']
      }))
    );
    setEditMode(true);
    setEditPlanId(planId);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast('Editing mode enabled.');
  };

  const handleAddCourse = () => {
    const newCourse = { id: Date.now(), name: '', prerequisites: [''] };
    setCourses([...courses, newCourse]);
  };

  const handleCourseChange = (id, updatedCourse) => {
    setCourses(courses.map(c => (c.id === id ? updatedCourse : c)));
  };

  const handleCourseRemove = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditPlanId(null);
    setPlanName('');
    setCourses([{ id: 1, name: '', prerequisites: [''] }]);
    toast('Edit cancelled.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please login to create a course plan.");
      toast.error("Please login to create a course plan.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessResult(null);

    const allCourseNames = new Set();
    const prerequisitesList = [];
    courses.forEach(course => {
      const courseName = course.name.trim();
      if (courseName) {
        allCourseNames.add(courseName);
        course.prerequisites.forEach(prereq => {
          const prereqName = prereq.trim();
          if (prereqName && prereqName !== courseName) {
            allCourseNames.add(prereqName);
            prerequisitesList.push([prereqName, courseName]);
          }
        });
      }
    });

    const payload = {
      name: planName.trim(),
      courses: Array.from(allCourseNames),
      prerequisites: prerequisitesList,
    };

    if (!payload.name || payload.courses.length === 0) {
      setError("Plan Name and at least one course are required.");
      setIsLoading(false);
      toast.error("Plan Name and at least one course are required.");
      return;
    }

    try {
      let response, data;
      if (editMode && editPlanId) {
        response = await fetch(`${API_BASE_URL}/api/topo/update/${editPlanId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Update failed.');
        setSuccessResult(data.sortedOrder);
        toast.success('Plan updated!');
      } else {
        response = await fetch(`${API_BASE_URL}/api/topo/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        data = await response.json();
        if (!response.ok) throw new Error(data.message || 'An unknown error occurred.');
        setSuccessResult(data.sortedOrder);
        toast.success('Plan created!');
      }

      fetchPlans();
      setPlanName('');
      setCourses([{ id: 1, name: '', prerequisites: [''] }]);
      setEditMode(false);
      setEditPlanId(null);

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrereqs = (prereqs) => prereqs.map(p => p.join(' → ')).join(', ');
  const formatResult = (result) => Array.isArray(result) ? result.join(' → ') : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50 to-blue-100 font-sans">
      <Toaster position="top-right" reverseOrder={false} />

      {/* HEADER */}
        <header className="relative backdrop-blur-md bg-white/60 border-b border-indigo-100 shadow-lg z-40">
          {/* Gradient strip */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-sky-400 to-blue-500 opacity-70 z-10" />
          <div className="relative max-w-7xl mx-auto px-4 py-5 sm:py-6 flex items-center justify-between">
            {/* App Branding */}
              <div className="flex items-center gap-4">
                {/* Home Icon Button */}
                <button
                  className="p-2 rounded-full text-indigo-500 bg-white hover:bg-indigo-50 shadow transition"
                  title="Go to Home"
                  onClick={() => window.location.href = "/"}
                  aria-label="Home"
                >
                  <FaHome className="w-6 h-6" />
                </button>

                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10,9a3,3 0 100-6 3 3 0 000,6ZM3,18a7,7 0 1114,0H3Z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-extrabold text-3xl text-indigo-700 tracking-tight drop-shadow">
                  COURSE  SCHEDULER
                </span>
              </div>
            {/* ...user area... */}
          </div>
        </header>



      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Create New Course Plan */}
          <section className="bg-white/90 p-8 rounded-2xl shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between gap-2 mb-7">
              <h2 className="text-2xl font-bold text-indigo-700">Create New Course Plan</h2>
              {editMode && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-medium text-gray-500 hover:text-red-600 px-3 py-1 rounded transition border border-gray-200"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label htmlFor="planName" className="block text-sm font-semibold text-gray-700 mb-1">Plan Name</label>
                <input
                  id="planName"
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., Semester 5 Schedule"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="space-y-6">
                {courses.map((course) => (
                  <CourseInput
                    key={course.id}
                    course={course}
                    onCourseChange={(updatedCourse) => handleCourseChange(course.id, updatedCourse)}
                    onCourseRemove={() => handleCourseRemove(course.id)}
                  />
                ))}
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md shadow-xs border border-red-200">
                    <strong>Error:</strong> {error}
                  </div>
                )}
                {successResult && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md shadow-xs border border-green-200">
                    Suggested Order: <span className="font-mono">{formatResult(successResult)}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="w-full py-2 rounded-md border border-indigo-600 text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  + Add Another Course
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-md font-semibold shadow-lg 
                    ${editMode
                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"}
                    transition disabled:opacity-60`}
                >
                  {isLoading ? (editMode ? 'Updating...' : 'Generating...') : (editMode ? 'Update Course Plan' : 'Generate Course Sequence')}
                </button>
              </div>
            </form>
          </section>

          {/* Saved Plans Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-indigo-700">Your Saved Plans</h2>
            {isPlansLoading ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">Loading plans...</div>
            ) : savedPlans.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">No saved plans found.</div>
            ) : (
              savedPlans.map((plan) => (
                <article
                  key={plan._id}
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300 relative group"
                >
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className="flex space-x-2">
                      <EditIcon onClick={() => handleEditPlan(plan._id)} />
                      <TrashIcon onClick={() => handleDeletePlan(plan._id)} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="bg-indigo-50/60 rounded px-2 py-1">
                      <strong className="font-semibold text-indigo-700">Courses:</strong> {plan.courses.join(', ')}
                    </div>
                    <div className="bg-indigo-50/60 rounded px-2 py-1">
                      <strong className="font-semibold text-indigo-700">Prerequisites:</strong> {formatPrereqs(plan.prerequisites)}
                    </div>
                    <div className="bg-indigo-50/60 rounded px-2 py-1">
                      <strong className="font-semibold text-indigo-700">Suggested Order:</strong>{' '}
                      <span className="text-indigo-600 font-semibold">{formatResult(plan.result)}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default CourseSchedulerPage;
