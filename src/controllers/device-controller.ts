import { authRepository } from "../infrastructure/repositories/auth-repositori";
import {Request, Response} from 'express'
import { deviceRepository } from "../infrastructure/repositories/device-repository";
import { DeviceService } from "../_application/device-service";

export class DeviceController {
    constructor(protected deviceService: DeviceService) {
     
    }
    async getDeviceByUserId(req: Request, res: Response){
      const refreshToken = req.cookies.refreshToken;
      
        if (!refreshToken) {
          return res.status(401).json({ message: 'Refresh token not found' });
        }
        const isValid = await authRepository.validateRefreshToken(refreshToken);
    
        if (!isValid || !isValid.userId || !isValid.deviceId) {
          return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const user = await authRepository.findUserByID(isValid.userId)
  
        if (!user) {
        return res.status(401).json({ message: 'User not found' });
        }
  
        const device = await deviceRepository.findDeviceById(isValid.deviceId);
        if (!device) {
        return res.status(401).json({ message: 'Device not found' });
        }
  
        if (isValid.userId !== device.userId) {
        return res.status(401).json({ message: 'Unauthorized access to device' });
        }
  
  
      const result = await deviceRepository.getAllDeviceByUserId(isValid.userId)
      
      if(result) {
          res.status(200).send(result)
      } else {
           res.sendStatus(401)
           }
      }
  
      async deleteAllDeviceExceptOneDevice(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const isValid = await authRepository.validateRefreshToken(refreshToken);
          if (!isValid || !isValid.userId || !isValid.deviceId) {
          return res.status(401).json({ message: 'Unauthorized ' });
          }
  
        const result = await deviceRepository.deleteAllExceptOne(isValid.userId,isValid.deviceId) // delete({userId, $..: deviceId})
          if(result) {
          res.sendStatus(204)
          } else {
          res.sendStatus(500)  
          }
        }
      async deleteDeviceById(req: Request, res: Response){
          const refreshToken = req.cookies.refreshToken;
          const deviceId = req.params.deviceId;
          const isValid = await authRepository.validateRefreshToken(refreshToken);
            if (!isValid || !isValid.userId || !isValid.deviceId) {
              return res.status(401).json({ message: 'Unauthorized ' });
              }
      
          const user = await authRepository.findUserByID(isValid.userId);
            if (!user) {
              return res.status(401).json({ message: 'User not found' });
            }
      
          const device = await deviceRepository.findDeviceById(deviceId)//
              if (!device) {
              return res.sendStatus(404);
            }
      
              if (device.userId !== isValid.userId ) {
              return res.sendStatus(403);
            }
      
          await deviceRepository.deleteDeviceId( deviceId)
              res.sendStatus(204)       
      }
  }
  