import { createBrowserRouter } from "react-router-dom";
import Home from "../Components/Home";
import CallerVideo from "../Components/CallerVideo";
import AnswerVideo from "../Components/AnswerVideo";
import ErrorPage from "./error-page";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/offer",
        element: <CallerVideo />,
    },
    {
        path: "/answer",
        element: <AnswerVideo />,
    },
]);
