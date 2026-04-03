export type AnimalStatus = 'available' | 'in-process' | 'adopted';
export type AnimalType = 'cat' | 'dog';
export type AnimalAge = 'young' | 'adult';

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  age: AnimalAge;
  gender: 'male' | 'female';
  description: string;
  image: File | string;
  status: AnimalStatus;
}
