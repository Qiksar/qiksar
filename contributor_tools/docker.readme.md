# Building containers for multiple architectures

The commands in this file are useful if you have not previously setup your container build process for multiple architectures.

This is useful if you wish to be able to build your environment using different operating systems, i.e. Windows, MacOS and Linux

```

## Setup docker buildx so you can build multi architecture images

docker buildx create --name multi_arch_buildx
docker buildx use multi_arch_buildx
docker buildx inspect --bootstrap

## Example of how to build an image for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t adamparco/demo:latest --push .


```