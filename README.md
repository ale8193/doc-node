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
