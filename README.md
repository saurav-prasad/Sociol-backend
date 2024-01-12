
## API Reference

#### Authentication

- Create a user
```http
  POST /auth/createuser
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `email` | **Required** |
| `username` | `string` | **Required**. max 15 & min 3 characters |
| `Password` | `string` | **Required**. min 6 characters |
| `Phone` | `number` | **Optional** |

Returns an object containing success, data, auth-token, message

- Get user by email and password
```http
  POST /auth/getuser
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `email` | **Required** |
| `Password` | `string` | **Required**. min 6 characters |

Returns an object containing success, data, auth-token, message


- Get user by auth-token
```http
  GET /auth/fetchuser
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message



