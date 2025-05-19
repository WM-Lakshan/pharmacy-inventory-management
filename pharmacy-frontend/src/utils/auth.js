export const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    // Handle both possible ID fields
    return user.id || user.manager_id || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  console.log(localStorage.getItem("token"));

  return !!localStorage.getItem("token");
};
