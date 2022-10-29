export const singleISODate = (date) => {
  let createdAt = date;
  let newISODate = createdAt.toISOString().slice(0,10);
  return newISODate
};

// useEffect(() => {
//   if (!token) {
//     dispatch({type: "LOGOUT"});
//     logoutUser();
//     return router.push("/");
//   }
//   setIsLoading(false);
// }, []);

// useEffect(() => {
//   if (!token || !Cookies.get("blog__isLoggedIn")) {
//     dispatch({type: "LOGOUT"});
//     logoutUser();
//     return router.push("/");
//   }
//   setIsLoading(false);
// }, []);

// useEffect(() => {
//     if (token && auth.isAuthenticated) {
//       dispatch({type: "GET_ALL_POSTS", payload: {posts: initGeneral.posts, trends: initTrend}});
//       dispatch({type: "GET_FOLLOW_STATUS", payload: initFollow});
//       localStorage.setItem("blog__trends", JSON.stringify(initTrend));
//       localStorage.setItem("blog__follows", JSON.stringify(initFollow));
//     }
//   }, [initGeneral]);