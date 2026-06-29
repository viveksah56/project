import type { Request, Response, NextFunction } from "express";
declare class UserController {
    createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const userController: UserController;
export default userController;
//# sourceMappingURL=user.controller.d.ts.map