import { DeviceRepository } from "../infrastructure/repositories/device-repository";

export class DeviceService {
  
    constructor(protected deviceRepository: DeviceRepository){
        
    }
}