import { z } from "zod";

export const EducationStatusSchema = z.enum(["GRADUATED", "COMPLETED"]);
