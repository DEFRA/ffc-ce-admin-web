# FFC Calculation Engine

This is a demo admin web interface for the FFC Calculation Engine

## Prerequisites

Either:
- Docker
- Docker Compose

Or:
- Kubernetes
- Helm

Or:
- Node 10

## Environment variables

The following environment variables are required by the application container. Values for development are set in the Docker Compose configuration. Default values for production-like deployments are set in the Helm chart and may be overridden by build and release pipelines.

| Name                                  | Description                | Required | Default               | Valid                       |
|---------------------------------------|----------------------------|:--------:|-----------------------|-----------------------------|
| NODE_ENV                              | Node environment           | no       | development           | development,test,production |
| PORT                                  | Port number                | no       | 3000                  |                             |
| STATIC_CACHE_TIMEOUT_IN_MILLIS        | static file cache timeout  | no       | 54000 (15 minutes)    |                             |
| REST_CLIENT_TIMEOUT_IN_MILLIS         | Rest client timout         | no       | 5000                  |                             |
| PAYMENT_URL                           | Payment Orchestrator URL   | yes      |                       |                             |

## How to run tests

A convenience script is provided to run automated tests in a containerised environment. The test script will cleanup and build the project prior to running the tests.

```
./scripts/test
```

It should be straight forward for the end user to inspect the test scripts so they can call commands individually to avoid a build or cleanup.

A "test watch" compose file is also available, that will rerun the tests in the container when files are edited locally. This may be run via 
```
docker-compose -f docker-compose.yaml -f docker-compose.test.watch.yaml up --force-recreate ffc-ce-admin-web
```

Alternatively, the same tests may be run locally via npm:

```
# Run tests without Docker
npm run test
```

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

By default, the start script will build (or rebuild) images so there will rarely be a need to build images manually. However, this can be achieved through the Docker Compose [build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Start and stop the service

Use Docker Compose to run service locally. 

`docker-compose up`

Additional Docker Compose files are provided for scenarios such as linking to other running services.

Link to other services:
```
docker-compose -f docker-compose.yaml -f docker-compose.link.yaml up
```

### Deploy to Kubernetes

For production deployments, a helm chart is included in the `.\helm` folder. This service connects to an AMQP 1.0 message broker, using credentials defined in [values.yaml](./helm/ffc-ce-admin-web/values.yaml), which must be made available prior to deployment.

Scripts are provided to test the Helm chart by deploying the service, along with an appropriate message broker, into the current Helm/Kubernetes context.

```
# Deploy to current Kubernetes context
scripts/helm/install

# Remove from current Kubernetes context
scripts/helm/delete
```

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress controller to be running on the cluster. For example, the NGINX Ingress Controller may be installed via Helm:

```
# Install nginx-ingress into its own namespace
helm install --namespace nginx-ingress nginx-ingress
```

Alternatively, a local port may be forwarded to the pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-ce deployment/ffc-ce-admin-web 3000:3000
```

Once the port is forwarded or an ingress controller is installed, the service can be accessed and tested in the same way as described in the "Test the service" section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

#### Basic Authentication

When deployed with an NGINX Ingress Controller, the ingress may be protected with basic authentication by passing the `--auth` (or `-a`) flag to the [Helm install](./scripts/helm/install) script. This relies on `htpasswd`, which must be available on the host system, and will prompt for a username and password.

```
# Deploy to the current Helm context with basic auth enabled
scripts/helm/install --auth
```

__How basic auth is configured__

Basic authentication is enabled via labels on the ingress object. Those labels are read by the NGINX Ingress Controller and used to configure basic authentication for incoming traffic. One of the labels provides the name of a Kubernetes secret in which credentials are stored as the encoded output of a `htpasswd` command. The ingress controller uses the value of that secret to verify any basic auth attempt.

If it wasn't defined by the Helm chart, the secret could be created via the following command:

```
# Create basic auth secret for username 'defra'
kubectl create secret generic ffc-ce-basic-auth2 --from-literal "auth=$(htpasswd -n defra)"
```

#### Amazon Load Balancer

Settings are available in the Helm charts to use the Amazon Load Balancer Ingress Controller rather than an NGINX Ingress Controller.
Additional child settings below `ingress` are available allowing the user to set [resource tags](https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#tags) and the arn of an [SSL certificate](https://kubernetes-sigs.github.io/aws-alb-ingress-controller/guide/ingress/annotation/#certificate-arn), i.e.
```
ingress:
  alb:
    tags: Name=myservername,Environment=myEnv,Project=MyProject,ServiceType=LOB
    arn: arn:aws:acm:eu-west-2:123456:certificate/abcdef0000-123a-4321-abc8-a1234567z
```

### Running without containers

The application may be run natively on the local operating if a Redis server is available on `localhost:6379`. First build the application using:

`$ npm run build`

Now the application is ready to run:

`$ node index.js`

## Build Pipeline

The [azure-pipelines.yaml](azure-pipelines.yaml) performs the following tasks:
- Runs unit tests
- Publishes test result
- Pushes containers to the registry tagged with the PR number or release version
- Deploys PRs to a temporary end point for review
- Deletes PR deployments, containers, and namepace upon merge

Builds will be deployed into a namespace with the format `ffc-ce-{identifier}` where `{identifier}` is either the release version, the PR number, or the branch name.

The builds will be available at the URL `http://ffc-ce-{identifier}.{ingress-server}`, where `{ingress-server}` is the ingress server defined the [`values.yaml`](./helm/ffc-ce-admin-web/values.yaml),  which is `vividcloudsolutions.co.uk` by default.

The temporary deployment requires a CNAME subdomain wildcard pointing to the public IP address of the ingress controller of the Kubernetes cluster. This can be simulated by updating your local `hosts` file with an entry for the build address set to the ingress controller's public IP address. On windows this would mean adding a line to `C:\Windows\System32\drivers\etc\hosts`, i.e. for PR 8 against the default ingress server this would be

xx.xx.xx.xx ffc-ce-pr8.vividcloudsolutions.co.uk

where `xx.xx.xx.xx` is the public IP Address of the Ingress Controller.

A detailed description on the build pipeline and PR work flow is available in the [Defra Confluence page](https://eaflood.atlassian.net/wiki/spaces/FFCPD/pages/1281359920/Build+Pipeline+and+PR+Workflow)

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
