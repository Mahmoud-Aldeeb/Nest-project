/*
https://docs.nestjs.com/openapi/decorators#decorators
*/

import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/utils/enums';

// Roles Method Decorator
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
