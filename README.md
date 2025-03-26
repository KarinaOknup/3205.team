<img width="798" alt="image" src="https://github.com/user-attachments/assets/cc737be3-217a-420e-8083-2537c2c595a2" />

## Intro
hi, my name is Karina Punko and i'm Software Developer.

this is solution of test task for 3205.team

hope u spend some time to check my solution.

## How to start it fast :rocket:
BEFORE:
check if u have docker

1) clone my repo `git clone git@github.com:KarinaOknup/3205.team.git`
2) open repository folder in terminal
3) run `npm run run-all`

check app at `http://localhost:3000/`

## How to check db :luggage:
example with pgAdmin 4:
1) open pgAdmin
2) register server with:

    | host name | port | username | password |
    | ----------- | ----------- | ----------- | ----------- |
    | localhost | 5432 | root | root |


3) check your tables

example of request:
```
SELECT * FROM public."Redirect";
```

## How to run separate :books:
### :writing_hand:database
1) open repository folder in terminal
2) run `npm infra`
### :robot:backend
1) open **api** folder in terminal
2) run `npm i` (i prefer to use node 20 ) 
3) check **.env** file and change DATABASE_URL part `db` --> `127.0.0.1`
4) run `npm run dev`
### :dizzy:frontend
1) open **web** folder in terminal
2) run `npm i` (i prefer to use node 20 ) 
3) run `npm run dev`

## Where to find tests :space_invader:
i write test only for urlService

u can find it in folder `../api/services/url.test.ts`


:sparkles: P.S. feel free to criticize! Even if my code is so terrible that there's nothing to comment on, I'd still appreciate any feedback :sparkles:
