import { GetUser } from "../Repositories/UserRepository.js";
import {
  SaveAccessToken,
  GetUserIDFromBearerToken,
} from "../Repositories/TokenRepository.js";

const TokenService = () => {
  return {
    GetClient,
    SaveAccessTokenAsync,
    GetUserAsync,
    GrantTypeAllowed,
    GetAccessToken,
  };
};

export const GetClient = (clientID, clientSecret, cbFunc) => {
  const client = {
    clientID,
    clientSecret,
    grants: null,
    redirectUris: null,
  };

  cbFunc(false, client);
};

export const GrantTypeAllowed = (clientID, grantType, cbFunc) => {
  cbFunc(false, true);
};

export const GetUserAsync = (username, password) => {
  return GetUser(username, password);
};

export const SaveAccessTokenAsync = (accessToken, clientID, expires, user) => {
  SaveAccessToken(accessToken, user.id);
};

export const GetAccessToken = (bearerToken, cbFunc) => {
  GetUserIDFromBearerToken(bearerToken, (userID) => {
    const accessToken = {
      user: {
        id: userID,
      },
      expires: null,
    };

    cbFunc(userID === null, userID === null ? null : accessToken);
  });
};

export default TokenService;
