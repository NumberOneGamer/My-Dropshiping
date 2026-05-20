export const authConfig = {
  providers: [],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request }: { auth: any; request: { nextUrl: any } }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isAdminDashboard = nextUrl.pathname.startsWith("/admin");

      if (isAdminDashboard) {
        if (!isLoggedIn) return false;
        if (auth.user.role !== "ADMIN") return false;
      }

      return true;
    },
  },
};
