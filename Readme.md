# prometheus-client demo

# Quickstart

To run this app, execute
```bash
yarn install
yarn start
```

To run it in development mode, with autoreload, run
```bash
yarn dev
```

# Deployment
To deploy on a kubernetes cluster, first install the prometheus operator for kubernetes.
An easy way to do this is through [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus).
After installing the kube-prometheus custom resource definitions, deploy the app manifests using kustomize
```shell
kubectl apply -k manifests
```

If you want to use a custom image, modify the `images` field in [manifests/kustomization.yaml] to your given
image name and tag