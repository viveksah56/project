import userService from "../services/user.service.js";
class UserController {
    async createUser(req, res, next) {
        try {
            const result = await userService.createUser(req.body);
            res.status(201).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const result = await userService.getAllUsers(req.query);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const user = await userService.updateUser(req.params.id, req.body);
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            await userService.deleteUser(req.params.id);
            res.status(200).json({ success: true, message: "User deleted successfully", data: null });
        }
        catch (error) {
            next(error);
        }
    }
}
const userController = new UserController();
export default userController;
//# sourceMappingURL=user.controller.js.map