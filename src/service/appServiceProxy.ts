import * as IUserService from "./user/IUserService";
import * as IRoleService from "./role/IRoleService";
import UserService from "./user/userService";
import RoleService from "./role/roleService";

export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
  role: IRoleService.IRoleServiceAPI;
}

class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  public role: IRoleService.IRoleServiceAPI;
  constructor() {
    this.user = new UserService(this);
    this.role = new RoleService(this);
  }
}

export default new AppServiceProxy();
