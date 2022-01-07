# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
COPY ./ScrumHubBackend /app/ScrumHubBackend
COPY ./ScrumHubBackendTests /app/ScrumHubBackendTests
WORKDIR /app/ScrumHubBackend
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out --no-restore

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out ./
CMD dotnet ScrumHubBackend.dll --urls=http://*:5033/