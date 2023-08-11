import * as IUserService from "./user/IUserService";
import * as IRoleService from "./role/IRoleService";
import UserService from "./user/userService";
import RoleService from "./role/roleService";
import * as IUploadFileService from "./fileUpload/IUploadFileService";
import UploadFileService from "./fileUpload/uploadFileService";

export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
  role: IRoleService.IRoleServiceAPI;
}


export interface JwtResponse{
  token: string | null, 
  error?: string
}
class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  public role: IRoleService.IRoleServiceAPI;
  public uploadFile: IUploadFileService.IUploadFileServiceAPI;
  constructor() {
    this.user = new UserService(this);
    this.role = new RoleService(this);
    this.uploadFile = new UploadFileService(this);
  }
}

export default new AppServiceProxy();
