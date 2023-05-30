declare module "next-auth" {
  interface User {
    name: {
      firstName: string;
      lastName: string;
    }
    preferences: {
      language: string;
      distanceUnit: string;
    }
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}