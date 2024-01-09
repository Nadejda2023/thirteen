import {Request, Response, Router } from "express";
import { deviceRepository } from "../infrastructure/repositories/device-repository";
import { authRepository } from "../infrastructure/repositories/auth-repositori";
import { deviceController } from "../composition-root";

export const deviceRouter = Router({})


deviceRouter.get ('/devices', deviceController.getDeviceByUserId.bind(deviceController)
 )


deviceRouter.delete ('/devices', deviceController.deleteAllDeviceExceptOneDevice.bind(deviceController)
 ) 


deviceRouter.delete ('/devices/:deviceId', deviceController.deleteDeviceById.bind(deviceController)
)
