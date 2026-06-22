import { z } from "zod";

export const DegreeSchema = z.enum(["BACHELOR", "MASTER", "DOCTOR"]);
