/**
 * Not-found route — rendered for any unmatched URL and used as the redirect
 * target for production-gated routes (e.g. /playground).
 * @see https://docs.expo.dev/router/error-handling/#unmatched-routes
 * @module app/+not-found
 */
import { Unmatched } from "expo-router";

export default Unmatched;
