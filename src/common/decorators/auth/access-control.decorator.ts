import { SetMetadata } from '@nestjs/common';

export const RoleKey = 'role';
export const RoleTagsKey = 'roleTags';

export const AccessControl = (role: string, ...roleTags: string[]) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(RoleKey, role)(target, key, descriptor);
    SetMetadata(RoleTagsKey, roleTags)(target, key, descriptor);
  };
};
