import {Router} from 'express'
import { authMiddleware } from '../middlewares/auth-middleware'
import { UsersInputValidation, emailConfiResValidation, registrationComfiValidation } from '../middlewares/usersvalidation'
import { customRateLimit } from '../middlewares/middleware_rateLimit'
import { forCreateNewPasswordValidation } from '../middlewares/authres'
import { authController } from '../composition-root'




export const authRouter = Router({})



  authRouter.post('/login',
  customRateLimit,
  authController.createAuthUser.bind(authController)
  )

  authRouter.post('/password-recovery',
  emailConfiResValidation,
  customRateLimit,
  authController.createPasswordRecovery.bind(authController)    
  )

  authRouter.post('/new-password',
  forCreateNewPasswordValidation,
  customRateLimit,
  authController.createNewPassword.bind(authController)
  )

  authRouter.post('/refresh-token',
  authController.createRefreshToken.bind(authController)
  )

  authRouter.post('/registration-confirmation',
  customRateLimit,
  registrationComfiValidation,
  authController.createRegistrationConfirmation.bind(authController)
  )  

  authRouter.post('/registration',
  customRateLimit,
  UsersInputValidation, 
  authController.createRegistration.bind(authController)
  )


  authRouter.post('/registration-email-resending',
  customRateLimit,
  emailConfiResValidation,
  authController.createRegistrationEmailResending.bind(authController)
  ) 

  authRouter.post('/logout',
  authController.createUserLogout.bind(authController)
        
  )

  authRouter.get('/me', 
  authMiddleware,
  authController.createUserMe.bind(authController)

  )