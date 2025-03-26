# SHORT UR URL

## Intro
hi, my name is Karina Punko and i'm Software Developer.
this is test task to company 3205.team

hope u spend some time to check my solution.

## How to start it fast
BEFORE:
Check if u have docker

1) clone my repo `git clone git@github.com:KarinaOknup/3205.team.git`
2) open repository folder in terminal
3) run `npm run run-all`

Check app at `http://localhost:3000/`

## How to check db
Example with pgAdmin 4:
1) open pgAdmin
2) Register server with:

    | host name | port | username | password |
    | ----------- | ----------- | ----------- | ----------- |
    | localhost | 5432 | root | root |


3) Check your tables

Example of request:
```
SELECT * FROM public."Redirect";
```

## How to run separate
### database
1) open repository folder in terminal
2) run `npm infra`
### backend
1) open **api** folder in terminal
2) run `npm i` (i prefer to use node 20 ) 
3) check **.env** file and change DATABASE_URL part `db` --> `127.0.0.1`
4) run `npm run dev`
### frontend
1) open **web** folder in terminal
2) run `npm i` (i prefer to use node 20 ) 
3) run `npm run dev`

## Where to find tests
I write test only for urlService

You can find it in folder `../api/services/url.test.ts`


P.S. Feel free to criticize! Even if my code is so terrible that there's nothing to comment on, I'd still appreciate any feedback :sparkles:
