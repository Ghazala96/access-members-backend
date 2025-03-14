import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const convertFromDateStringToDateTime = (dateString: string): DateTime => {
  return DateTime.fromISO(dateString, { zone: 'utc' });
};
