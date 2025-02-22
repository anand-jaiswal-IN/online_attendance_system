function Leave() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
        Leave Application
      </h1>
      <form className="max-w-lg bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <label
            className="block text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2"
            htmlFor="reason"
          >
            Reason for Leave
          </label>
          <input
            className="shadow-sm appearance-none border-2 border-purple-100 rounded-lg w-full py-3 px-4 text-purple-700 leading-tight focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-300"
            id="reason"
            type="text"
            placeholder="Enter reason"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2"
            htmlFor="from-date"
          >
            From Date
          </label>
          <input
            className="shadow-sm appearance-none border-2 border-purple-100 rounded-lg w-full py-3 px-4 text-purple-700 leading-tight focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-300"
            id="from-date"
            type="date"
          />
        </div>
        <div className="mb-8">
          <label
            className="block text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2"
            htmlFor="to-date"
          >
            To Date
          </label>
          <input
            className="shadow-sm appearance-none border-2 border-purple-100 rounded-lg w-full py-3 px-4 text-purple-700 leading-tight focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-300"
            id="to-date"
            type="date"
          />
        </div>
        <button
          className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-300 hover:scale-[1.02] hover:from-pink-600 hover:to-purple-700"
          type="submit"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
export default Leave;
