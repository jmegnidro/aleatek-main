import React, { useState, useEffect } from 'react';

const Flash = ({ children, type, setFlash }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setFlash(false)
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [setFlash]);

  const closeFlash = () => {
    setIsVisible(false);
    setFlash(false)
  };

  return (
    <>
      {isVisible && (
        <div
          className={`fixed top-0 right-0 m-4 p-4 rounded shadow-md ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="mr-2">{children}</p>
            <button onClick={closeFlash} className="text-white focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm4.95 12.95l-1.414 1.415L10 11.414l-3.536 3.536-1.415-1.415L8.586 10l-3.536-3.536 1.415-1.415L10 8.586l3.536-3.536 1.415 1.415L11.414 10l3.536 3.536z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Flash;
