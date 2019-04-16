# DOC

Node service to execute backup 

### Set up
To start the node:

1. clone the repository
2. install node modules
3. start the server

```
# clone
git clone https://github.com/ale8193/doc-node.git
cd doc-node

# install dependences
yarn install

# start server
yarn start
```

### Generate documentation
##### Code documentation
The documentation of the code will be generated inside `<project_root>/docs`using the following command:
```
yarn docs
```
##### Swagger api documentation
The `swagger.yml` with the openapi documentation is provided inside the root of the project.

##### Docker-compose
The documentation con be deployed using a compose file in which there are 2 services:

1. A swagger-ui image that load the `swagger.json documentation`
2. A nginx image that load the static page of the code documentation (that need firstly to be created using the steps before)

To run this compose simply:
```
docker-compose -f docs-compose.yml up -d
```
Then navigate to `http://localhost` (for the code documentation) and to `http://localhost:8889` for the swagger documentation