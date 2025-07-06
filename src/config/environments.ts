export const environments = {
  DEVELOPMENT: {
    CLOUDPHYSICIAN_BACKEND_SERVICE: "http://localhost:3000/",
    CLOUDPHYSICIAN_PLAYER_SERVICE: "http://localhost:3001/",
    CLOUDPHYSICIAN_SOCKET_SERVICE: "ws://localhost:3002/",
    CLOUDPHYSICIAN_LOGIN_SERVICE: "http://localhost:3003/",
  },
  STAGING: {
    CLOUDPHYSICIAN_BACKEND_SERVICE: "https://staging.cloudphysicianworld.com/api_ai/",
    CLOUDPHYSICIAN_PLAYER_SERVICE: "https://staging.cloudphysicianworld.com/player/",
    CLOUDPHYSICIAN_SOCKET_SERVICE: "wss://staging.cloudphysicianworld.com/socket/",
    CLOUDPHYSICIAN_LOGIN_SERVICE: "https://staging.cloudphysicianworld.com/login",
  },
  PRODUCTION: {
    CLOUDPHYSICIAN_BACKEND_SERVICE: "https://cloudphysicianworld.com/api_ai/",
    CLOUDPHYSICIAN_PLAYER_SERVICE: "https://cloudphysicianworld.com/player/",
    CLOUDPHYSICIAN_SOCKET_SERVICE: "wss://cloudphysicianworld.com/socket/",
    CLOUDPHYSICIAN_LOGIN_SERVICE: "https://cloudphysicianworld.com/login",
  },
}; 