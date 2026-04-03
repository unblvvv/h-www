export type AnimalStatus = 'available' | 'in-process' | 'adopted';
export type AnimalType = 'cat' | 'dog' | 'unknown';
export type AnimalAge = string;
export type AnimalGender = string;

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  age: AnimalAge;
  gender: AnimalGender;
  description: string;
  image: File | File[] | string | string[];
  status: AnimalStatus;
}
