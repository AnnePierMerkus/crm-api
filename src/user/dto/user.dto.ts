export interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  address?: {
    line1: string;
    city: string;
    zip: string;
    country: string;
  };
  phoneNumber: string;
}
