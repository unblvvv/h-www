export type AnimalStatus = 'available' | 'in-process' | 'adopted';
export type AnimalAge = string;
export type AnimalSex = string;

export interface Animal {
  id: string;
  name: string;
  age: AnimalAge;
  sex: AnimalSex;
  description: string;
  image: File | File[] | string | string[];
  status: AnimalStatus;
}
