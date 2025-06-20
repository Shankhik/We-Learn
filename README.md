# We Learn
This is an e-learning platform built with Next.js, designed to provide users with an intuitive interface for accessing and engaging with educational content. The app includes user authentication, dynamic course content, progress tracking, and a responsive design.

You can view `CHANGELOG.md` for the changes made on different commits.

#### Framework: [`NextJS`](https://nextjs.org)
#### Database: [`MongoDB Atlas`](https://www.mongodb.com/products/platform/atlas-database)
#### Hosting Service: [`Render`](https://render.com)

## Setting Up Locally

### Clone the Repository
```bash
git clone 'https://github.com/Shankhik/We-Learn.git'
```

### Installing Packages
```bash
npm install
```

### Create Environment Files
- Create ```.env.development``` and ```.env.production``` in the root folder.
- ```.env.development```: 
```bash
NEXT_PUBLIC_API_DOMAIN = '<local domain>'
MONGODB_URI_DEV = '<dev mongodb uri>'
SECRET_KEY = '<jwt secret key>'
```
- ```.env.production```: 
```bash
NEXT_PUBLIC_API_DOMAIN = '<production domain>'
MONGODB_URI = '<production mongodb uri>'
SECRET_KEY = '<jwt secret key>'
```

## Running Dev Server
```bash
npm run dev
```

## Running Production Server
Note: Not recommended to run locally
```bash
npm run build && npm run start
```