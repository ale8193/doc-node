# DOC

[![Join the chat at https://gitter.im/doc-node/community](https://badges.gitter.im/doc-node/community.svg)](https://gitter.im/doc-node/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Node service to execute backup 

### Set up
To start the node:

1. clone the repository
2. install node modules
3. Set up the configuration file
4. start the server

```
# clone
git clone https://github.com/ale8193/doc-node.git
cd doc-node

# install dependences
yarn install

# start server
yarn start
```

### Build
To build the node:

1. install modules
2. Set up the configuration file
3. build the node
```
# install dependences
yarn install

# build server
yarn build
```

### Config file
The config file is located in the root and it's named `config.json` it should contain:

- `sender` property with the configuration of the sender (now only webdav is available)

Here an example:
```json
{
  "sender": {
    "type": "webdav",
    "host": "http://localhost:8888/webdav",
    "path": "/backup"
  }
}

```

### Generate documentation
##### Code documentation
The documentation of the code will be generated inside `<project_root>/docs`using the following command:
```
yarn docs
```
##### Swagger api documentation
The `swagger.yml` with the openapi documentation is provided inside the root of the project.

### Run on docker
To run on docker it's necessary to generate the production build then it's necessary to build the docker image:
```
docker build -t doc-node .
```
Finally, run the container:
```
docker run -d --name doc-node -p 5555:5555 -v /var/run/docker.sock:/var/run/docker.sock doc-node
```
