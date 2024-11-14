api routes
    - getting all entries(builds entry) in db
        - allBuild        GET
    - getting particular entry(specific build) from db
        - Build           GET
    - updating particular entry(specific build) from db
        - updateBuild     PATCH
    - create new entry(specific build row) in db
        - createBuild     POST


to start server, after cloning this git branch
    - create a .env file which should contain PORT and PostgreSQL DB string
    - install dependencies by npm i
    and run node index.js