import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getProjects,
  getInWorkingProjects,
  getCertificates,
  getMessages,
  getHero,
  getSession,
} from "../api/admin.api.js";

// Save this file as context/Context.jsx (the same place as before).
// Your components keep working: they still use `useContext(Context)`.
// You can also use the `useAppData()` hook at the bottom of this file.

// eslint-disable-next-line react-refresh/only-export-components
export const Context = createContext(null);

/* ------------------------------------------------------------------ */
/* Settings                                                             */
/* ------------------------------------------------------------------ */

const RETRY_DELAY = 1000; // wait 1s before the 1st retry, 2s before the 2nd
const MAX_RETRIES = 2; // so a request is tried up to 3 times in total

// Which API function loads which list, and what the list is called in the response.
// TO ADD A NEW LIST: add it here, add a state + setter below (see "SETTERS"),
// and put it in the value at the bottom. If visitors may see it, also add it to PUBLIC.
const RESOURCES = {
  hero: { api: getHero, key: "hero", label: "Hero settings" },
  projects: { api: getProjects, key: "projects", label: "Projects" },
  inWorkingProjects: {
    api: getInWorkingProjects,
    key: "inWorkingProjects",
    label: "In Working Projects",
  },
  certificates: { api: getCertificates, key: "certificates", label: "Certificates" },
  messages: { api: getMessages, key: "messages", label: "Messages" },
};

// Lists that every visitor can see. They load when the app opens.
// (Messages are NOT here: they are private and only load for a logged-in user.)
const PUBLIC = ["hero", "projects", "inWorkingProjects", "certificates"];

// { projects: null, inWorkingProjects: null, ... }  (one empty slot per list)
const EMPTY_ERRORS = Object.fromEntries(Object.keys(RESOURCES).map((name) => [name, null]));

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

// APIs answer in different shapes. Always give back a plain array:
//   [ ... ]   |   { projects: [ ... ] }   |   { data: [ ... ] }   |   { data: { projects: [ ... ] } }
// (Axios puts the body inside `response.data`, which is handled too.)
const extractList = (response, key) => {
  const result = response?.data ?? response;

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.[key])) return result[key];
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.[key])) return result.data[key];

  return [];
};

// Retry only when trying again can help: no connection, timeout, too many requests, server errors.
// Errors like 401 (not logged in), 403 or 404 will not change, so they fail straight away.
const isRetryable = (error) => {
  const status = error?.response?.status ?? error?.status;
  if (!status) return true; // network problem
  return status === 408 || status === 429 || status >= 500;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Run a request, and retry it when it is worth it. Stops early if the app is gone.
const fetchWithRetry = async (apiFunction, isCancelled) => {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await apiFunction();
    } catch (error) {
      lastError = error;

      const canRetry = attempt < MAX_RETRIES && isRetryable(error) && !isCancelled();
      if (!canRetry) break;

      // 1s, 2s ... plus a small random extra so many visitors do not retry at the same moment
      await wait(RETRY_DELAY * 2 ** attempt + Math.random() * 250);
      if (isCancelled()) break;
    }
  }

  throw lastError;
};

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Request failed";

/* ------------------------------------------------------------------ */
/* Provider                                                             */
/* ------------------------------------------------------------------ */

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [hero, setHero] = useState(null);
  const [inWorkingProjects, setInWorkingProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true); // first load of the public lists
  const [refreshing, setRefreshing] = useState(false); // later reloads (data stays on screen)
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  const mountedRef = useRef(false); // is the provider still on the page?
  const inflightRef = useRef({}); // requests that are running right now (stops duplicates)
  const userRef = useRef(null); // always holds the latest user (used inside async code)

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  /* ---------- Load one list (never throws) ---------- */
  const load = useCallback((name) => {
    // The same request is already running: share it instead of sending another one
    if (inflightRef.current[name]) return inflightRef.current[name];

    const { api, key } = RESOURCES[name];

    // SETTERS: one setter for each list in RESOURCES
    const setters = {
      projects: setProjects,
      hero: setHero,
      inWorkingProjects: setInWorkingProjects,
      certificates: setCertificates,
      messages: setMessages,
    };

    if (name === "messages") setMessagesLoading(true);

    const request = (async () => {
      try {
        const response = await fetchWithRetry(api, () => !mountedRef.current);
        if (!mountedRef.current) return;

        // Messages are private: if the user logged out while loading, throw the result away
        if (name === "messages" && !userRef.current) return;

        setters[name](
          name === "hero" ? response?.data ?? response : extractList(response, key)
        );
        setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
      } catch (error) {
        if (!mountedRef.current) return;
        console.error(`Failed to load ${name}:`, error);
        // The old data stays on screen, only the error message is set
        setErrors((prev) => ({ ...prev, [name]: getErrorMessage(error) }));
      } finally {
        inflightRef.current[name] = null;
        if (mountedRef.current && name === "messages") setMessagesLoading(false);
      }
    })();

    inflightRef.current[name] = request;
    return request;
  }, []);

  /* ---------- First load: public data ---------- */
  useEffect(() => {
    mountedRef.current = true;

    Promise.all(PUBLIC.map(load)).finally(() => {
      if (mountedRef.current) setLoading(false);
    });

    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  useEffect(() => {
    getSession()
      .then((session) => {
        if (mountedRef.current) setUser(session);
      })
      .catch(() => {
        if (mountedRef.current) setUser(null);
      });
  }, []);

  /* ---------- Messages: only for a logged-in user ----------
     Messages hold your visitors' private details, so they are NOT loaded for
     normal visitors. They load when `user` is set (after login) and are
     cleared when `user` becomes null (after logout). */
  useEffect(() => {
    if (user) {
      load("messages");
    } else {
      setMessages((prev) => (prev.length ? [] : prev));
      setErrors((prev) => (prev.messages ? { ...prev, messages: null } : prev));
    }
  }, [user, load]);

  /* ---------- Reload everything (for a "Refresh" button) ---------- */
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      ...PUBLIC.map(load),
      userRef.current ? load("messages") : null,
    ]);
    if (mountedRef.current) setRefreshing(false);
  }, [load]);

  const refreshMessages = useCallback(() => load("messages"), [load]);

  // One short text for banners, e.g. "Unable to load: Projects, Messages"
  const error = useMemo(() => {
    const failed = Object.keys(errors)
      .filter((name) => errors[name] && RESOURCES[name])
      .map((name) => RESOURCES[name].label);
    return failed.length > 0 ? `Unable to load: ${failed.join(", ")}` : null;
  }, [errors]);

  // Only changes when something really changed, so components do not re-render for nothing
  const value = useMemo(
    () => ({
      user,
      setUser,

      projects,
      setProjects,
      hero,
      setHero,

      inWorkingProjects,
      setInWorkingProjects,

      certificates,
      setCertificates,

      messages,
      setMessages,

      loading, // true only during the very first load
      refreshing, // true while a manual refresh is running
      messagesLoading,
      error, // one text, or null
      errors, // details per list: { projects, inWorkingProjects, certificates, messages }

      refreshData,
      refreshMessages,
    }),
    [
      user,
      projects,
      hero,
      inWorkingProjects,
      certificates,
      messages,
      loading,
      refreshing,
      messagesLoading,
      error,
      errors,
      refreshData,
      refreshMessages,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

// Handy hook: gives an error if you use it outside <ContextProvider>
// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => {
  const value = useContext(Context);
  if (!value) throw new Error("useAppData must be used inside <ContextProvider>");
  return value;
};

export default ContextProvider;