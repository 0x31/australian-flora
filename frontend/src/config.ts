export const API =
    process.env.REACT_APP_API ||
    (!process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? "http://localhost:8080/api"
        : "https://flora.noiach.com/api");
