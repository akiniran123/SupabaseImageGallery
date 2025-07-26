import { v4 as uuidv4 } from 'uuid';

export function generateFileName(originalName, userId) {
  return `${userId}/${uuidv4()}-${originalName}`;
}
