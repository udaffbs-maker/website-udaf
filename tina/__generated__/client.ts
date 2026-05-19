import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'fe1b7018afc4b68e43e74545eff1035fcd6b9aaa', queries,  });
export default client;
  