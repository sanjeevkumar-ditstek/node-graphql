import proxy from "../service/appServiceProxy";
import { userRoutes } from '../helper/routes';

const userRoute = async (app: any) => {
    // app.get(userRoutes.UsersRoute , proxy.user.getUsers);
	app.post(userRoutes.UsersRoute , proxy.user.create);
	// app.post("/user/login", proxy.user.login);
	// app.get(userRoutes.UserByIdRoute , proxy.user.getUserById);
};

export default userRoute;
