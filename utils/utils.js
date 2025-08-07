import { redirect } from "next/navigation";

export function encodedRedirect(type, path, message) {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}