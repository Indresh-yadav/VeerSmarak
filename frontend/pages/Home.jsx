const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 transition duration-300 hover:scale-110 hover:drop-shadow-lg">
        VeerSmarak
      </h1>
      <p className="mt-4 text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-green-500 to-blue-500">
        A Tribute to Our Heroes
      </p>
    </div>
  );
};

export default Home;
