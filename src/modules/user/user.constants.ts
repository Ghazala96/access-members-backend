export enum UserRole {
  User = 'User'
}

export const UserRoleTag = {
  User: {
    Attendee: 'Attendee',
    Organizer: 'Organizer'
  }
};

export const UserRoleTagValues: string[] = Object.values(UserRoleTag).flatMap((tags) =>
  Object.values(tags)
);

export const MinNameLength = 3;
