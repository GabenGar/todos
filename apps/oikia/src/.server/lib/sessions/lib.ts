import { SESSION_SECRET_KEY } from "#server/environment";
import { createCookieSessionStorage } from "react-router";

type SessionData = {
  auth_id: string;
};

const maxAge = 60 * 60 * 24 * 30;

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge,
      path: "/",
      sameSite: "strict",
      secrets: [SESSION_SECRET_KEY],
      secure: true,
      isSigned: true,
    },
  });

export { getSession, commitSession, destroySession };
