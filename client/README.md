![Express Test Image](https://camo.githubusercontent.com/0566752248b4b31b2c4bdc583404e41066bd0b6726f310b73e1140deefcc31ac/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67)

# <!-- Title --> React Google Login Lite

> <!-- Description --> A Google oAUth Sign-in / Log-in Component for React

# Install

`npm install react-google-login-lite`

# How to use

```jsx
import GoogleLogin from "react-google-login-lite";
// or
import { GoogleLogin } from "react-google-login-lite";

const onSuccess = (googleUser) => {
  console.log(googleUser);
};

const onFailure = (err) => {
  console.log(err);
};

//or typescript
const onSuccess = (googleUser: GoogleLoginResponse) => {
  console.log(googleUser);
};

const onFailure = (err: any) => {
  console.log(err);
};

ReactDOM.render(
  <GoogleLogin
    client_id="your-google-client-id"
    cookiepolicy="single_host_origin"
    onSuccess={onSuccess}
    onFailure={onFailure}
  />,
  document.getElementById("root")
);
```

# Stay Logged in

`isSignedIn={true}` attribute will call `onSuccess` callback on load to keep the user signed in.

```jsx
<GoogleLogin
  client_id="your-google-client-id"
  cookiepolicy="single_host_origin"
  onSuccess={onSuccess}
  onFailure={onFailure}
  isSignedIn={true}
/>
```

# onSuccess callback

1. In the onSuccess(googleUser) {...} callback function, you can use:

   - googleUser.getId()
   - googleUser.getBasicProfile()
   - You should get back a standard JWT located at googleUser.getAuthResponse().id_token

1. Send this id_token to your server
1. Have your server decode the id_token by using a common JWT library such as [google-auth-library](https://www.npmjs.com/package/google-auth-library) or by sending a GET request to `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=YOUR_TOKEN_HERE`

   - https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=YOUR_TOKEN_HERE

# Login Props

<!-- Tables -->

| Property | Value  |
| -------- | ------ |
| Name     | `Amer` |
| age      | `17`   |

<!-- Task -->

- [ ] Task
- [x] Task 2
