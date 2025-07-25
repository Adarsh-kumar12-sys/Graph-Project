
// import React from 'react';

// // Smaller trash icon button
// const TrashIcon = ({ onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="text-gray-400 hover:text-red-500 transition-colors rounded-full p-1 hover:bg-red-100"
//     aria-label="Remove"
//   >
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//       <path
//         fillRule="evenodd"
//         d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
//         clipRule="evenodd"
//       />
//     </svg>
//   </button>
// );

// function CourseInput({ course, onCourseChange, onCourseRemove }) {
//   const handleCourseNameChange = (e) => {
//     onCourseChange({ ...course, name: e.target.value });
//   };

//   const handleAddPrereq = () => {
//     const newPrereqs = [...course.prerequisites, ''];
//     onCourseChange({ ...course, prerequisites: newPrereqs });
//   };

//   const handlePrereqChange = (index, value) => {
//     const newPrereqs = [...course.prerequisites];
//     newPrereqs[index] = value;
//     onCourseChange({ ...course, prerequisites: newPrereqs });
//   };

//   const handleRemovePrereq = (index) => {
//     const newPrereqs = course.prerequisites.filter((_, i) => i !== index);
//     onCourseChange({ ...course, prerequisites: newPrereqs });
//   };

//   return (
//     <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200 relative">
//       {/* Remove Course Button */}
//       <div className="absolute top-3 right-3">
//         <TrashIcon onClick={onCourseRemove} />
//       </div>

//       {/* Course Name Input */}
//       <div className="mb-5">
//         <label htmlFor={`course-name-${course.id}`} className="block text-sm font-semibold text-gray-700 mb-1">
//           Course Name
//         </label>
//         <input
//           id={`course-name-${course.id}`}
//           type="text"
//           value={course.name}
//           onChange={handleCourseNameChange}
//           placeholder="e.g., Machine Learning"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//         />
//       </div>

//       {/* Prerequisites Section */}
//       <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-3">Prerequisites</label>

//         <div className="space-y-3">
//           {course.prerequisites.map((prereq, index) => (
//             <div key={index} className="flex items-center gap-3">
//               <input
//                 type="text"
//                 value={prereq}
//                 onChange={(e) => handlePrereqChange(index, e.target.value)}
//                 placeholder="e.g., Mathematics"
//                 className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//               />
//               <TrashIcon onClick={() => handleRemovePrereq(index)} />
//             </div>
//           ))}
//         </div>

//         <button
//           type="button"
//           onClick={handleAddPrereq}
//           className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//         >
//           + Add Prerequisite
//         </button>
//       </div>
//     </div>
//   );
// }

// export default CourseInput;



import React from 'react';

const TrashIcon = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-gray-400 hover:text-red-500 transition-colors rounded-full p-1 hover:bg-red-100"
    aria-label="Remove"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

function CourseInput({ course, onCourseChange, onCourseRemove }) {
  const handleCourseNameChange = (e) => {
    onCourseChange({ ...course, name: e.target.value });
  };

  const handleAddPrereq = () => {
    const newPrereqs = [...course.prerequisites, ''];
    onCourseChange({ ...course, prerequisites: newPrereqs });
  };

  const handlePrereqChange = (index, value) => {
    const newPrereqs = [...course.prerequisites];
    newPrereqs[index] = value;
    onCourseChange({ ...course, prerequisites: newPrereqs });
  };

  const handleRemovePrereq = (index) => {
    const newPrereqs = course.prerequisites.filter((_, i) => i !== index);
    onCourseChange({ ...course, prerequisites: newPrereqs });
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200 relative transition-all duration-200 hover:shadow-xl">
      {/* Remove Course Button */}
      <div className="absolute top-3 right-3 z-10">
        <TrashIcon onClick={onCourseRemove} />
      </div>

      {/* Course Name Input */}
      <div className="mb-4">
        <label htmlFor={`course-name-${course.id}`} className="block text-sm font-semibold text-gray-700 mb-1">
          Course Name
        </label>
        <input
          id={`course-name-${course.id}`}
          type="text"
          value={course.name}
          onChange={handleCourseNameChange}
          placeholder="e.g., Machine Learning"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Prerequisites Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Prerequisites</label>
        <div className="space-y-2">
          {course.prerequisites.map((prereq, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={prereq}
                onChange={(e) => handlePrereqChange(index, e.target.value)}
                placeholder="e.g., Mathematics"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <TrashIcon onClick={() => handleRemovePrereq(index)} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddPrereq}
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          + Add Prerequisite
        </button>
      </div>
    </div>
  );
}

export default CourseInput;



