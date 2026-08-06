# About Page



### Performance

* We learn is a Single Page Application that used React library ensuring a smooth page navigation.
* Ensures fast initial page load followed by the data; giving users a smooth user experience.
* UI elements are loaded only when they visible (or about to be). This boosts the performance signicantly.



### Performance (Dev)

* We Learn is a SPA created with NextJS (uses React Library) framework that handles both front-end and back-end.
* Uses SSR (Server Side Rendering) ensuring fast initial page load followed by fetched page data.
* Lazy Loading of expensive components improves performance significantly.



### Security and Privacy

* Heavily focuses on user's privacy and data security, so that only the user can access their data.
* None of the data of the users are being shared with anyone to any extent.
* Extension to Prev: "The security is being constantly improved as fast as possible for 1 user. So please hang in there :)"



### Security and Privacy (Dev)

* Uses JWT authentication with token saved as a cookie (same-site + http-only).
* None of the data of the users are being shared with anyone to any extent.
* Secure routes access is managed by middleware.
* Extension to Prev: "The security is being constantly improved as fast as possible for 1 user. So please hang in there :)"



### Data Management

* All the data is securely stored in: No-SQL database, Content Deliver Network



### Data Management (Dev)

* All the users data is securely stored in: MongoDB, Cloudinary.
* Cloudinary file references (like version) are saved in MongoDB documents.



### Cookies and Caches

* Cookies are used to save the user's preference on their browsers.
* Caching is used to deliver the best experience possible for users reducing the load on database.



### Cookies and Caches (Dev)

* Cookies are used to save the user's preference on their browsers. All the cookies stored are essential fro the functioning of the app.
* Server caching and client caching is used to deliver the best experience possible for users reducing the load on MongoDB database.
* Client side caching uses local storage for storing user specific data. This is implemented using Tanstack Query with persistent storage (local-storage) so that data persists even after a fresh load / reload.
* Server Side caching is handled by NextJS; Redis will used in the future to some extent.

