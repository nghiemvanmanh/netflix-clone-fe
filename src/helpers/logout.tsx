export const handleSignOut = (Cookies: any, router: any) => {
  Cookies.remove("user");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("selectedProfile");
  router.push("/login");
};
