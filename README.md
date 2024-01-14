
# Sociol

It is a backend application for a social media app with all the necessary routes required for creating a social media application. 
## Available routes

- Authentications
- Profiles
- Posts
- Likes
- Comments
- Follow

## Tech Stack

This backend was built using the following technologies and tools:

- Backend:
  - Node
  - Express
  - MongoDB
  - Mongoose
  - Json Web Token
  - BcryptJs
  - Express Validator
  - Firebase
  - Cors


- Hosting & Deployment:
  - Vercel

- Version Control:
  - Git
  - GitHub

## Environment Variables

To run this application, you will need to add the url of your mongodb database url as a environment variable to your .env file.

`MONGO_URI` will be name of the environment variable.



## URL

The hosted url of the app is https://sociol-backend.vercel.app/


## API Reference

#### **Authentication**

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

Returns an object containing success, data, auth-token, message.

- Get user by email and password
```http
  POST /auth/getuser
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `email` | **Required** |
| `Password` | `string` | **Required**. min 6 characters |

Returns an object containing success, data, auth-token, message.


- Get user by auth-token
```http
  GET /auth/fetchuser
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.


#### **Profiles**

- Get a profile by profile id
```http
  GET /profile/getprofile/:{profileId}
```

Returns an object containing success, data, message.

- Get user by username
```http
  GET /profile/getprofile/:{username}
```

Returns an object containing success, data, message.


- Get all profiles
```http
  GET /profile/getallprofiles
```

Returns an object containing success, data, message.

- Get profile by auth-token
```http
  GET /profile/fetchuser
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.

- Update a profile by auth-token
```http
  GET /profile/fetchuser
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Optional** |
| `bio` | `string` | **Optional**|
| `profilePhoto` | `url` | **Optional** |
| `phone` | `number` | **Optional** |
| `about` | `string` | **Optional** |
| `username` | `string` | **Optional** max 15 & min 3 characters |
| `email` | `email` | **Optional** |

Returns an object containing success, data, message.


#### **Posts**


- Create a post
```http
  POST /post/createuser
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image` | `url` | **Optional** |
| `text` | `string` | **Optional** |

Returns an object containing success, data, message.

- Get a post by post id
```http
  GET /post/getpost/:{postId}
```

Returns an object containing success, data, message.


- Get all the post of a user by profile id
```http
  GET /post/getpostbyprofileid/:{profileId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.


- Get all the posts
```http
  GET /post/getallpost
```

Returns an object containing success, data, message.


- Get all the post by auth token
```http
  GET /post/fetchpost
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.


- Get all the post by post id
```http
  POST /post/updatepost/:{postId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image` | `url` | **Optional** |
| `text` | `string` | **Optional** |

Returns an object containing success, data, message.

- Delete a post by post id

```http
  DELETE /post/deletepost/:{postId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |


Returns an object containing success, message.

#### **Comments**


- Create a comment by post id
```http
  POST /comment/createcomment/:{postId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `comment` | `string` | **Required** min 1 character |

Returns an object containing success, data, message.

- Get all the comment of a post by post id
```http
  GET /comment/getcomment/:{postId}
```

Returns an object containing success, data, message.


- Update a comment by comment id
```http
  POST /comment/updatecomment/:{commentId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `comment` | `string` | **Required** min 1 character |

Returns an object containing success, data, message.

- Delete a comment by comment id
```http
  DELETE /comment/deletecomment/:{commentId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |


Returns an object containing success, message.

#### **Likes**


- Like a post by post id
```http
  GET /like/like/:{postId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |


Returns an object containing success, data, message.

- Unlike a post by post id
```http
  GET /like/unlike/:{postId}
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.

- Check if a post is liked or not
```http
  GET /like/iflike/:{postId}
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.

#### **Follows**


- Follow a profile by profile id
```http
  GET /follow/createfollow/:{profileId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.

- Unfollow a profile by profile id
```http
  GET /follow/unfollow/:{profileId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, message.


- Check if a user follows a profile or not
```http
  GET /follow/iffollow/:{profileId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.

- Get all the followers of a profile by profile id
```http
  GET /follow/getfollowers/:{profileId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.


- Get all the followings of a profile by profile id
```http
  GET /follow/getfollowings/:{profileId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.


- Get total number of followers of a profile by profile id
```http
  GET /follow/gettotalfollowers/:{profileId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.

- Get total number of followings of a profile by profile id
```http
  GET /follow/gettotalfollowings/:{profileId}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `auth-token` | `string` | **Required** |

Returns an object containing success, data, message.





## Installation

Provide instructions for setting up and running your project locally. Include any prerequisites, environment setup, and installation steps.

```bash
# Clone the repository
git clone https://github.com/saurav-prasad/Sociol-backend.git

# Install dependencies
npm install

# Start the development server
npm start
