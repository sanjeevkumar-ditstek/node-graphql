import userRoute from "../routes/userRouter";

const routes = async (app: any) => {
	userRoute(app);
};
export default routes;
