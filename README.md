# Node_Homework
This is my Node.js homework, thanks for reading this.
In this project i built a task list API, in which i use users.json file as data base.
I have such routes: 
~ GET (/users) - get all users
~ GET (/users/:id) - get certain user
~ POST (/users) - add a new user
~ PUT (/users/:id) - changes some user's properties
~ PUT (/users/:id/done) - changes user's done property to true
~ PUT (/users/:id/undone) - changes user's done property to false
~ DELETE (/users/:id) - deletes a user
~ any type (*/) - any other route leads to 404 page
There is also implemented 400 (bad request) and 403 (forbidden) responses.

All this functionality covered by unit tests, which describes a whole picture a bit.
Unit tests was written using mocha.js, chai.js, and supertest.js
