export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

export type RandomUserApiResponse = {
  results: RandomUserApiUser[];
};

export type RandomUserApiUser = {
  login: { uuid: string };
  name: { first: string; last: string };
  gender: Gender;
  email: string;
  picture: { large: string; medium: string; thumbnail: string };
  location: {
    city: string;
    country: string;
    coordinates: { latitude: string; longitude: string };
  };
};

export type User = {
  id: string;
  fullName: string;
  gender: Gender;
  email: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  avatarLarge: string;
  avatarSmall: string;
};
