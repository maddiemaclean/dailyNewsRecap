# Project Structure

**File Structure**
```
yourDailyNewsBites/
├── db/
 |   ├── ...allStoredProcedures.sql
├── src/
 |   ├── news
  |   |   ├── newsMain.js
 |   ├── users
 |   |   ├── controller.js
 |   |   ├── db_access.js
 |   |   ├── routes.js
 |   |   ├── utils.js
├── tests/
 |   ├── ...allJestTests.test.js
├── .gitignore
├── jest.config.js
├── package-lock.json
├── package.json
├── readme.md
├── server.js
```

**Database Schema**
```
a. users
 - user_id (Primary Key)
 - email
 - password_hash (Hashed)
 - is_verified

b. verification
 - user_id (Primary and Foreign Key)
 - verification_code
 - created_at

c. categories
 - category_id (Primary Key)
 - name

d. user_categories
 - user_id (Primary and Foreign Key)
 - category_id (Primary and Foreign Key)

e. news
 - news_id (Primary Key)
 - category_id (Foreign Key)
 - date
 - title
 - link
 - name
 - description
```

**Endpoints**
```
a. authenication
 - /api/auth/register (POST): Adds a new user
 - /api/auth/verify (POST): Verifies a new user
 - /api/auth/login (POST): Logins in a user with an existing account

b. user management
- /api/users/getUsers (GET): Returns a list of all users
- /api/users/getUser (GET): Returns a specific user
- /api/users/changeEmail (PUT): Replaces a user's email
- /api/users/changePassword (PUT): Changes a user's password
- /api/users/removeUser (DELETE): Removes a user's account

c. categories
- /api/categories/getCategories (GET): Return's a specific user's categories
- /api/categories/addCategory (POST): Adds a new category to a users' account
- /api/categories/removeCategory (DELETE): Removes a category from a user's account

d. news
- /api/news/getStories (GET): Returns all daily stories for a specific category
```
