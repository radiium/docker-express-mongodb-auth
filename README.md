## Dockerized node app authentication demo
  
#### Dependencie:
- Docker
- Node (≥v6.x.x)
  
## How Use:
  
#### Setup environment variable:
Edit environment file  
    - For Node App: in app/config/app.env  
    - For MongoDB: in db/mongo.env  
  
> /!\ For the field 'APP_PASS' in db/mongo.env, you must generate password hash by running
```sh
node ./utils/pass.js <your first user password>
```
  
#### Build and run node app and mongodb container:
```sh
chmod +x run.sh && ./run.sh
```  
  
#### Check:
And it's all, you can access to the app by [localhost:8083](http://localhost:8083)  
  