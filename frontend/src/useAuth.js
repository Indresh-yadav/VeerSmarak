const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return {
    user: user || null,
    token: user?.token || null,
    role: user?.role || null,
    isLoggedIn: !!user?.token,
  };
};

export default useAuth;
