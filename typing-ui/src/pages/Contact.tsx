import React from "react";

const Contact = () => {
  return (
    <div className="mx-auto my-auto min-h-[60vh] flex items-center justify-center px-4 self-center-safe">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Contact Us
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          This is currently a demo project. We’ll update the contact page once
          we have our own domain. Until then, feel free to explore our work on
          GitHub.
        </p>
      </div>
    </div>
  );
};

export default Contact;
