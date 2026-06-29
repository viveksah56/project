import type { Request, Response, NextFunction } from "express";
import { type ZodType } from "zod";
declare const validate: (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => void;
export default validate;
//# sourceMappingURL=validation.middleware.d.ts.map