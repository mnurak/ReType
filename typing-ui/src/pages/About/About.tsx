const About = () => {
  return (
    <div className="bg-gray-50 h-full w-[80%] mx-auto text-center py-4 px-4 sm:px-6 lg:px-8">
      <div className=" bg-linear-to-br from-blue-100 via-white to-amber-50 m-6 p-12 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <h1 className="text-5xl font-bold text-blue-700 mb-6">
          👋 Welcome to <span className="text-amber-600">Re-Type</span>
        </h1>
        <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-4xl  mx-auto">
          A platform where you can test and improve your typing speed by uploading a PDF and typing its contents—helping you learn from the material while improving your typing at the same time.
        </p>

        <div className="grid lg:grid-cols-2 gap-14">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🚀 Why Re-Type?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              This Platform provide you the opportunity to type the things you need, while other platform just give you the random words which don't make any proper sentences.
              this also help you learn your material.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎯 Our Mission
            </h2>
            <p className="text-lg text-gray-700">
              To give the user to learn his material, while typing. this improves in reading and also typing.
            </p>
          </div>

          <div>
            {/* need to add the key features  */}

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ⚙️ Tech Stack
            </h2>
            <p className="text-lg text-gray-700">
              React + TailwindCSS on the frontend, with Fast API and postgresql
              powering the backend. Also utilizing the IDB for pdf storage in the local.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-xl text-gray-600 italic mb-2">
            Let’s add more features, and make shure it's simple. 🔗
          </p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Re-Type · Built with Passion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
